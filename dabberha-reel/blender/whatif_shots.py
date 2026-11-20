"""3D shots for «ماذا لو؟», rendered by Blender (Workbench engine) with a transparent background.

    blender -b --factory-startup -P blender/whatif_shots.py -- <shot> <frames> <out.webm> [--still F out.png]

Each shot is only the 3D objects and the camera. Remotion adds the sky, fog, glow, captions, voice and sound.
Shots: earth, ai, money, mind, net, alien, age, tunnel, question.
"""
import math, random, sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector, noise

argv = sys.argv[sys.argv.index("--") + 1:]
SHOT, FRAMES, OUT = argv[0], int(argv[1]), Path(argv[2]).resolve()
STILL = int(argv[argv.index("--still") + 1]) if "--still" in argv else None
STILL_OUT = argv[argv.index("--still") + 2] if "--still" in argv else None
random.seed(7)

sc = bpy.context.scene
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
sc.render.fps = 30
sc.frame_start, sc.frame_end = 1, FRAMES
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 100
sc.render.engine = "BLENDER_WORKBENCH"
sc.render.film_transparent = True
sc.display.render_aa = "8"
sc.view_settings.view_transform = "Standard"
SH = sc.display.shading
SH.light, SH.color_type = "STUDIO", "MATERIAL"
SH.show_object_outline = False
SH.show_shadows, SH.show_cavity, SH.show_specular_highlight = False, True, True
SH.cavity_type = "BOTH"
sc.world = bpy.data.worlds.new("w")


def lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c)


MATS = {}
def mat(h):
    if h not in MATS:
        m = bpy.data.materials.new(h)
        m.diffuse_color = (*lin(h), 1)
        m.roughness, m.metallic = 0.35, 0.0
        MATS[h] = m
    return MATS[h]


def finish(o, color, name=None):
    if name:
        o.name = name
    o.data.materials.clear()
    o.data.materials.append(mat(color))
    return o


def sphere(r, loc, color, seg=32, ring=16):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=ring)
    bpy.ops.object.shade_smooth()
    return finish(bpy.context.object, color)


def ico(r, loc, color, sub=2):
    bpy.ops.mesh.primitive_ico_sphere_add(radius=r, location=loc, subdivisions=sub)
    bpy.ops.object.shade_smooth()
    return finish(bpy.context.object, color)


def cyl(r, depth, loc, color, rot=(0, 0, 0), verts=32):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    bpy.ops.object.shade_smooth()
    return finish(bpy.context.object, color)


def torus(R, r, loc, color, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=64, minor_segments=16)
    bpy.ops.object.shade_smooth()
    return finish(bpy.context.object, color)


def box(size, loc, color, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.scale = size
    return finish(o, color)


def link(a, b, r, color):
    """A thin rod between two points."""
    a, b = Vector(a), Vector(b)
    d = b - a
    o = cyl(r, d.length, (a + b) / 2, color, verts=8)
    o.rotation_mode = "QUATERNION"
    o.rotation_quaternion = d.to_track_quat("Z", "Y")
    return o


def key(o, attr, frame, value):
    setattr(o, attr, value)
    o.keyframe_insert(attr, frame=frame)


def pop(o, at, dur=8, to=None):
    """Scale from nothing to its size, starting at frame `at`."""
    s = tuple(o.scale) if to is None else to
    key(o, "scale", 1, (0, 0, 0))
    key(o, "scale", max(1, at), (0, 0, 0))
    key(o, "scale", at + dur, s)


def vanish(o, at, dur=8):
    s = tuple(o.scale)
    key(o, "scale", at, s)
    key(o, "scale", at + dur, (0, 0, 0))


def camera(path, target=(0, 0, 0), lens=50):
    """path: [(frame, (x, y, z)), ...] looking at target."""
    cd = bpy.data.cameras.new("cam")
    cd.lens, cd.sensor_fit, cd.sensor_width = lens, "HORIZONTAL", 36
    cd.clip_start, cd.clip_end = 0.05, 500
    cam = bpy.data.objects.new("cam", cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    tgt = bpy.data.objects.new("target", None)
    sc.collection.objects.link(tgt)
    tgt.location = target
    c = cam.constraints.new("TRACK_TO")
    c.target, c.track_axis, c.up_axis = tgt, "TRACK_NEGATIVE_Z", "UP_Y"
    for f, p in path:
        key(cam, "location", f, p)
    return cam, tgt


def spin(o, axis, deg_per_frame):
    i = "xyz".index(axis)
    r = list(o.rotation_euler)
    key(o, "rotation_euler", 1, tuple(r))
    r[i] += math.radians(deg_per_frame * FRAMES)
    key(o, "rotation_euler", FRAMES, tuple(r))
    for fc in o.animation_data.action.fcurves:
        if fc.data_path == "rotation_euler":
            for kp in fc.keyframe_points:
                kp.interpolation = "LINEAR"


# ------------------------------------------------------------------------------------------------- shots
def earth():
    """A planet whose continents are coloured per vertex, turning slowly; the camera pushes in."""
    SH.color_type = "VERTEX"
    bpy.ops.mesh.primitive_uv_sphere_add(radius=2.0, segments=320, ring_count=160)
    o = bpy.context.object
    bpy.ops.object.shade_smooth()
    me = o.data
    col = me.color_attributes.new("Col", "BYTE_COLOR", "CORNER")
    for poly in me.polygons:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co
            n = noise.fractal(v * 0.9 + Vector((3.1, 1.7, 0.4)), 0.6, 2.2, 6)
            lat = abs(v.z) / 2.0
            if lat > 0.94:
                c = lin("#e8f1f7")
            elif n > 0.08:
                c = lin("#4f8a3c") if n < 0.38 else lin("#9a8a5a")
            else:
                c = lin("#0d3b78") if n < -0.25 else lin("#1d5aa6")
            col.data[li].color = (*c, 1)
    o.rotation_euler = (math.radians(23), 0, 0)
    spin(o, "z", 0.12)
    camera([(1, (0, -7.4, 0.5)), (FRAMES, (0, -5.6, 0.25))], lens=50)


def ai():
    """A network of nodes that light up one after another, shaped like a brain; the camera circles it."""
    SH.light = "FLAT"
    SH.show_cavity = False
    nodes = []
    while len(nodes) < 70:
        p = Vector((random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1)))
        if p.length <= 1:
            nodes.append(Vector((p.x * 2.2, p.y * 1.7, p.z * 1.5)))
    order = sorted(range(len(nodes)), key=lambda i: nodes[i].x)
    for k, i in enumerate(order):
        o = ico(0.09 if k % 5 else 0.14, nodes[i], "#67e4ff" if k % 4 else "#ffffff")
        pop(o, 4 + k, 6)
    links = 0
    for i, a in enumerate(nodes):
        near = sorted(range(len(nodes)), key=lambda j: (nodes[j] - a).length)[1:3]
        for j in near:
            if j > i:
                o = link(a, nodes[j], 0.012, "#3d7cff")
                pop(o, 6 + order.index(i), 10)
                links += 1
    core = ico(0.45, (0, 0, 0), "#8e6cff", 3)
    pop(core, 40, 16)
    pts = [(f, (6.0 * math.sin(f / FRAMES * 1.4 - 0.7), -6.0 * math.cos(f / FRAMES * 1.4 - 0.7), 0.9)) for f in range(1, FRAMES + 1, 8)]
    camera(pts + [(FRAMES, pts[-1][1])], lens=50)


def money():
    """Gold coins rain down and stack, then dissolve to nothing one by one."""
    SH.show_shadows = True
    coins = []
    for i in range(46):
        x, y = random.uniform(-1.6, 1.6), random.uniform(-1.0, 1.0)
        z_end = -1.6 + (i % 9) * 0.09 if i < 18 else random.uniform(-1.4, 2.0)
        o = cyl(0.42, 0.07, (x, y, z_end), "#e2b33c", rot=(random.uniform(-0.5, 0.5), random.uniform(-0.5, 0.5), 0))
        o.data.materials.append(mat("#b88a1e"))
        land = 4 + i
        key(o, "location", 1, (x, y, z_end + 8))
        key(o, "location", land, (x, y, z_end + 8 - 0.0))
        key(o, "location", land + 14, (x, y, z_end))
        spin(o, "z", random.uniform(-4, 4))
        coins.append(o)
    for i, o in enumerate(sorted(coins, key=lambda c: -c.location.z)):
        vanish(o, 58 + i, 10)
    camera([(1, (0, -7.5, 1.4)), (FRAMES, (0, -6.3, 1.0))], target=(0, 0, -0.2), lens=45)


def mind():
    """A wireframe head of light; a scanning ring passes through and pulls small sparks (secrets) out of it."""
    SH.light = "FLAT"
    SH.show_cavity = False
    bpy.ops.mesh.primitive_ico_sphere_add(radius=1.0, subdivisions=3)
    head = bpy.context.object
    head.scale = (1.15, 1.35, 1.45)
    w = head.modifiers.new("wire", "WIREFRAME")
    w.thickness = 0.018
    finish(head, "#ff7ad9")
    bpy.ops.mesh.primitive_ico_sphere_add(radius=0.62, subdivisions=4, location=(0, 0.05, 0.35))
    brain = bpy.context.object
    brain.modifiers.new("wire", "WIREFRAME").thickness = 0.012
    finish(brain, "#67e4ff")
    spin(head, "z", 0.25)
    spin(brain, "z", -0.4)
    ring = torus(1.75, 0.025, (0, 0, -1.8), "#ffffff")
    key(ring, "location", 1, (0, 0, -1.9))
    key(ring, "location", 70, (0, 0, 1.9))
    key(ring, "location", 120, (0, 0, -1.2))
    for i in range(26):
        p = Vector((random.uniform(-0.4, 0.4), random.uniform(-0.3, 0.3), random.uniform(0.0, 0.8)))
        s = ico(0.05, p, "#ffd23f", 1)
        start = 110 + i * 3
        key(s, "location", start, p)
        key(s, "location", start + 40, p + Vector((random.uniform(-1.6, 1.6), -3.5, random.uniform(-0.6, 1.6))))
        pop(s, start, 6)
    camera([(1, (2.5, -6.2, 0.8)), (FRAMES, (0.8, -5.0, 0.5))], target=(0, 0, 0.2), lens=45)


def net():
    """A dark globe laced with glowing links; the links snap off one by one and the lights go out."""
    SH.light = "FLAT"
    SH.show_cavity = False
    g = sphere(2.0, (0, 0, 0), "#0b1430", 96, 48)
    pts = []
    for i in range(22):
        th, ph = random.uniform(0, 2 * math.pi), math.acos(random.uniform(-0.8, 0.8))
        pts.append(Vector((2.02 * math.sin(ph) * math.cos(th), 2.02 * math.sin(ph) * math.sin(th), 2.02 * math.cos(ph))))
    parent = bpy.data.objects.new("rig", None)
    sc.collection.objects.link(parent)
    cut = 34
    for i, p in enumerate(pts):
        d = ico(0.06, p, "#ffd23f", 1)
        d.parent = parent
        vanish(d, cut + 30 + i * 2, 6)
    arcs = 0
    pairs = [(pts[i], pts[(i * 7 + 3) % len(pts)]) for i in range(len(pts))] + [(pts[i], pts[(i + 5) % len(pts)]) for i in range(0, len(pts), 2)]
    for a, b in pairs:
        mid = (a + b) / 2
        mid = mid.normalized() * (2.0 + 0.45 * (a - b).length)
        prev = a
        for k in range(1, 9):
            t = k / 8
            q = (1 - t) ** 2 * a + 2 * (1 - t) * t * mid + t ** 2 * b
            seg = link(prev, q, 0.02, "#67e4ff")
            seg.parent = parent
            vanish(seg, cut + arcs + k, 4)
            prev = q
        arcs += 1
    for o in (g,):
        o.parent = parent
    spin(parent, "z", 0.18)
    camera([(1, (0, -6.6, 1.5)), (FRAMES, (0, -5.8, 1.0))], lens=50)


def alien():
    """A ringed planet and its moon; a signal pulses out from the moon's surface."""
    p = sphere(1.8, (0, 0, 0), "#7a4fd6", 96, 48)
    ring = torus(3.0, 0.32, (0, 0, 0), "#d9b8ff", rot=(math.radians(74), 0, math.radians(18)))
    ring.scale = (1, 1, 0.06)
    spin(p, "z", 0.15)
    moon = sphere(0.45, (-3.4, -1.2, 1.6), "#b7b7c4", 48, 24)
    for i in range(3):
        r = torus(0.3, 0.02, (-3.4, -1.2, 1.6), "#7dffb2", rot=(math.radians(90), 0, 0))
        start = 20 + i * 30
        key(r, "scale", 1, (0, 0, 0))
        key(r, "scale", start, (0.2, 0.2, 0.2))
        key(r, "scale", start + 40, (6, 6, 6))
        key(r, "scale", start + 41, (0, 0, 0))
    camera([(1, (1.6, -8.4, 2.0)), (FRAMES, (0.6, -6.9, 1.3))], target=(-0.6, 0, 0.4), lens=40)


def age():
    """A slowly turning double helix (DNA), built up rung by rung."""
    SH.light = "FLAT"
    SH.show_cavity = False
    rig = bpy.data.objects.new("rig", None)
    sc.collection.objects.link(rig)
    n = 34
    for i in range(n):
        z = -3.4 + i * 0.2
        a = i * 0.42
        p1 = Vector((math.cos(a) * 0.9, math.sin(a) * 0.9, z))
        p2 = Vector((math.cos(a + math.pi) * 0.9, math.sin(a + math.pi) * 0.9, z))
        s1, s2 = ico(0.1, p1, "#67e4ff", 1), ico(0.1, p2, "#ff7ad9", 1)
        r = link(p1, p2, 0.025, "#ffffff")
        for o in (s1, s2, r):
            o.parent = rig
            pop(o, 2 + i * 2, 6)
    spin(rig, "z", 0.9)
    camera([(1, (0, -6.5, -2.2)), (FRAMES, (0, -5.2, 1.0))], target=(0, 0, -0.4), lens=40)


def tunnel():
    """Flying through rings of light (time); past inventions drift by: a bulb, an airplane, a phone."""
    SH.light = "FLAT"
    SH.show_cavity = False
    L = 140
    for i in range(46):
        y = i * 3.0
        c = ["#67e4ff", "#8e6cff", "#ff7ad9", "#ffd23f"][i % 4]
        torus(3.2, 0.05, (0, y, 0), c, rot=(math.radians(90), 0, 0))
    SH.light = "STUDIO"
    SH.show_cavity = True

    def bulb(at):
        g = sphere(0.5, (1.4, at, 0.9), "#fff1b8")
        cyl(0.22, 0.4, (1.4, at, 0.4), "#9a9aa4")

    def plane(at):
        cyl(0.22, 2.2, (-1.5, at, 0.6), "#e9edf6", rot=(0, math.radians(90), 0))
        box((0.5, 2.6, 0.06), (-1.5, at, 0.6), "#c8d0dc")
        box((0.3, 0.8, 0.05), (-2.4, at, 0.7), "#c8d0dc")
        box((0.3, 0.05, 0.5), (-2.5, at, 0.9), "#c8d0dc")

    def phone(at):
        o = box((0.8, 0.08, 1.6), (1.2, at, -0.8), "#14161d", rot=(0, math.radians(-12), 0))
        box((0.7, 0.02, 1.45), (1.2, at - 0.05, -0.8), "#3d7cff", rot=(0, math.radians(-12), 0))

    bulb(40)
    plane(70)
    phone(100)
    camera([(1, (0, -6, 0)), (FRAMES, (0, L, 0))], target=(0, 400, 0), lens=24)
    cam = sc.camera
    for fc in cam.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"
    tgt = bpy.data.objects["target"]
    key(tgt, "location", 1, (0, 400, 0))


def question():
    """A large question mark (mirrored so it reads as the Arabic «؟»), lit like a monument; slow turn and push-in."""
    SH.show_shadows = True
    bpy.ops.object.text_add(location=(0, 0, 0), rotation=(math.radians(90), 0, 0))
    t = bpy.context.object
    t.data.body = "?"
    t.data.align_x, t.data.align_y = "CENTER", "CENTER"
    t.data.size = 4.2
    t.data.extrude = 0.35
    t.data.bevel_depth = 0.04
    t.scale.x = -1
    t.data.materials.append(mat("#f2f2f5"))
    key(t, "rotation_euler", 1, (math.radians(90), 0, math.radians(-25)))
    key(t, "rotation_euler", FRAMES, (math.radians(90), 0, math.radians(18)))
    camera([(1, (0.5, -7.6, 0.5)), (FRAMES, (0.15, -5.6, 0.2))], target=(0, 0, 0.1), lens=50)


{"earth": earth, "ai": ai, "money": money, "mind": mind, "net": net, "alien": alien, "age": age, "tunnel": tunnel, "question": question}[SHOT]()

im = sc.render.image_settings
if STILL:
    sc.frame_set(STILL)
    im.file_format, im.color_mode = "PNG", "RGBA"
    sc.render.filepath = STILL_OUT
    bpy.ops.render.render(write_still=True)
else:
    im.file_format = "FFMPEG"
    ff = sc.render.ffmpeg
    ff.format, ff.codec = "WEBM", "WEBM"
    im.color_mode = "RGBA"
    ff.constant_rate_factor = "HIGH"
    ff.audio_codec = "NONE"
    sc.render.filepath = str(OUT.with_suffix("")) + "_"
    bpy.ops.render.render(animation=True)
    made = sorted(OUT.parent.glob(OUT.stem + "_*.webm"))
    if made:
        made[-1].replace(OUT)
print("SHOT_DONE", SHOT, FRAMES)
