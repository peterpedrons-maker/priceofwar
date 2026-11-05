extends Control
# Menu principal do Price of War — port de teste do menu do jogo web (src/App.tsx, MainMenu).
# Tudo é montado por código para o menu ficar num arquivo só e fácil de comparar com a versão web.
# As medidas em fração (0..1) foram tiradas das mesmas artes usadas no jogo web.

const A := "res://assets/"
const U := "res://assets/ui/"
const CINZEL: FontFile = preload("res://assets/fonts/cinzel-regular.woff2")
const CINZEL_DECO: FontFile = preload("res://assets/fonts/cinzel-decorative-700.woff2")

const AVATARS := ["avatar-01", "avatar-02", "avatar-04", "avatar-05", "avatar-06", "avatar-07"]
const PROFILE_PATH := "user://profile.cfg"

const CIRCLE_SHADER := """
shader_type canvas_item;
void fragment() {
	vec4 c = texture(TEXTURE, UV);
	float d = distance(UV, vec2(0.5));
	c.a *= 1.0 - smoothstep(0.49, 0.5, d);
	COLOR = c;
}
"""

var W: float
var H: float
var profile := {"name": "Comandante", "avatar": 3, "level": 3, "xp": 0.35, "coroas": 150}
var avatar_rect: TextureRect
var modal: Control = null


func _ready() -> void:
	var s := get_viewport_rect().size
	W = s.x
	H = s.y
	_load_profile()
	_build_background()
	_build_logo()
	_build_cards()
	_build_bottom_row()
	_build_profile_bar()
	# Uso interno: `godot --path . -- --shot=caminho.png` salva um print e sai (para testes).
	for arg in OS.get_cmdline_user_args():
		if arg == "--open=avatar":
			_open_avatar_picker()
		elif arg == "--open=soon":
			_show_coming_soon("Online", "Os duelos contra outros jogadores (casual e ranqueado) ainda estão por vir.")
		elif arg.begins_with("--shot="):
			_shot(arg.trim_prefix("--shot="))


func _shot(path: String) -> void:
	await get_tree().process_frame
	await get_tree().process_frame
	await get_tree().create_timer(0.6).timeout
	get_viewport().get_texture().get_image().save_png(path)
	get_tree().quit()


# ---------------------------------------------------------------- helpers

func _tex(path: String) -> Texture2D:
	return load(path)


func _rect(parent: Control, tex: Texture2D, pos: Vector2, sz: Vector2) -> TextureRect:
	var t := TextureRect.new()
	t.texture = tex
	t.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	t.stretch_mode = TextureRect.STRETCH_SCALE
	t.position = pos
	t.size = sz
	t.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(t)
	return t


func _label(parent: Control, text: String, font: Font, px: int, color: Color, pos: Vector2, sz: Vector2, align := HORIZONTAL_ALIGNMENT_LEFT) -> Label:
	var l := Label.new()
	l.text = text
	l.add_theme_font_override("font", font)
	l.add_theme_font_size_override("font_size", px)
	l.add_theme_color_override("font_color", color)
	l.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.9))
	l.add_theme_constant_override("outline_size", 3)
	l.position = pos
	l.size = sz
	l.horizontal_alignment = align
	l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	l.clip_text = true
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(l)
	return l


func _spaced(base: Font, glyph_spacing: int) -> FontVariation:
	var f := FontVariation.new()
	f.base_font = base
	f.spacing_glyph = glyph_spacing
	return f


func _invisible_button(parent: Control, sz: Vector2) -> Button:
	var b := Button.new()
	b.size = sz
	b.flat = true
	b.focus_mode = Control.FOCUS_NONE
	for state in ["normal", "hover", "pressed", "focus", "disabled"]:
		b.add_theme_stylebox_override(state, StyleBoxEmpty.new())
	parent.add_child(b)
	return b


# Efeito de "apertar" (o whileTap do web): o nó encolhe um pouco enquanto o dedo está em cima.
func _press_effect(button: Button, target: Control) -> void:
	target.pivot_offset = target.size / 2.0
	button.button_down.connect(func(): create_tween().tween_property(target, "scale", Vector2(0.97, 0.97), 0.08))
	button.button_up.connect(func(): create_tween().tween_property(target, "scale", Vector2.ONE, 0.12))


# ---------------------------------------------------------------- perfil (guardado em user://)

func _load_profile() -> void:
	var cfg := ConfigFile.new()
	if cfg.load(PROFILE_PATH) == OK:
		profile["name"] = cfg.get_value("profile", "name", profile["name"])
		profile["avatar"] = clampi(int(cfg.get_value("profile", "avatar", profile["avatar"])), 0, AVATARS.size() - 1)


func _save_profile() -> void:
	var cfg := ConfigFile.new()
	cfg.set_value("profile", "name", profile["name"])
	cfg.set_value("profile", "avatar", profile["avatar"])
	cfg.save(PROFILE_PATH)


# ---------------------------------------------------------------- fundo e logo

func _build_background() -> void:
	var bg := TextureRect.new()
	bg.texture = _tex(A + "start-screen-bg.webp")
	bg.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	bg.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bg)
	# Escurecido de cima para baixo, igual ao gradiente do menu web.
	var grad := Gradient.new()
	grad.offsets = PackedFloat32Array([0.0, 0.5, 1.0])
	grad.colors = PackedColorArray([Color(0, 0, 0, 0.1), Color(0, 0, 0, 0.4), Color(0, 0, 0, 0.85)])
	var gt := GradientTexture2D.new()
	gt.gradient = grad
	gt.fill_from = Vector2(0, 0)
	gt.fill_to = Vector2(0, 1)
	gt.width = 4
	gt.height = 256
	var shade := TextureRect.new()
	shade.texture = gt
	shade.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	shade.stretch_mode = TextureRect.STRETCH_SCALE
	shade.set_anchors_preset(Control.PRESET_FULL_RECT)
	shade.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(shade)


func _build_logo() -> void:
	var tex := _tex(A + "logo-price-of-war.webp")
	var lw := minf(W * 0.54, 215.0)
	var lh := lw * tex.get_height() / tex.get_width()
	_rect(self, tex, Vector2((W - lw) / 2.0, 88.0 + 4.0), Vector2(lw, lh))


# ---------------------------------------------------------------- barra de perfil

func _build_profile_bar() -> void:
	var top := 10.0
	var content_w := W - 24.0
	# Placa do perfil (arte 1679x499)
	var pw := minf(content_w * 0.67, 268.0)
	var ph := pw * 499.0 / 1679.0
	var plate := Control.new()
	plate.position = Vector2(12.0, top)
	plate.size = Vector2(pw, ph)
	add_child(plate)
	_rect(plate, _tex(U + "ui-profile-plate.webp"), Vector2.ZERO, plate.size)

	var d := pw * 0.20
	var avatar_btn_parent := Control.new()
	avatar_btn_parent.position = Vector2(pw * 0.175 - d / 2.0, ph * 0.476 - d / 2.0)
	avatar_btn_parent.size = Vector2(d, d)
	plate.add_child(avatar_btn_parent)
	avatar_rect = _rect(avatar_btn_parent, _tex(U + AVATARS[profile["avatar"]] + ".webp"), Vector2.ZERO, Vector2(d, d))
	var mat := ShaderMaterial.new()
	var sh := Shader.new()
	sh.code = CIRCLE_SHADER
	mat.shader = sh
	avatar_rect.material = mat
	var ab := _invisible_button(avatar_btn_parent, Vector2(d, d))
	ab.pressed.connect(_open_avatar_picker)

	# Nível no escudo
	var lvl := pw * 0.08
	_label(plate, str(profile["level"]), _spaced(CINZEL, 0), int(pw * 0.052), Color("f8ecd0"),
		Vector2(pw * 0.334 - lvl / 2.0, ph * 0.73 - lvl / 2.0), Vector2(lvl, lvl), HORIZONTAL_ALIGNMENT_CENTER)
	# Nome dentro do recorte escuro da placa
	_label(plate, profile["name"], _spaced(CINZEL, 0), maxi(8, int(pw * 0.034)), Color("f8ecd0"),
		Vector2(pw * 0.42, ph * 0.26), Vector2(pw * 0.49, ph * 0.19))
	# Barra de XP (cosmética, igual ao web)
	var track_x := pw * 0.426
	var track_w := pw * 0.444
	var fill := Panel.new()
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color("d4af37")
	sb.set_corner_radius_all(6)
	fill.add_theme_stylebox_override("panel", sb)
	fill.position = Vector2(track_x, ph * 0.602)
	fill.size = Vector2(track_w * float(profile["xp"]), ph * 0.046)
	fill.mouse_filter = Control.MOUSE_FILTER_IGNORE
	plate.add_child(fill)

	# Pílula de Coroas (arte 800x210)
	var cw := minf(content_w * 0.30, 128.0)
	var ch := cw * 210.0 / 800.0
	var pill := Control.new()
	pill.position = Vector2(W - 12.0 - cw, top + (ph - ch) / 2.0)
	pill.size = Vector2(cw, ch)
	add_child(pill)
	_rect(pill, _tex(U + "ui-pill-coroas.webp"), Vector2.ZERO, pill.size)
	var ci := cw * 0.15
	_rect(pill, _tex(U + "ui-icon-coroa.webp"), Vector2(cw * 0.13 - ci / 2.0, ch * 0.5 - ci / 2.0), Vector2(ci, ci))
	_label(pill, str(profile["coroas"]), _spaced(CINZEL, 0), int(cw * 0.125), Color("f8ecd0"),
		Vector2(cw * 0.27, ch * 0.2), Vector2(cw * 0.42, ch * 0.6))
	var pi := cw * 0.13
	var plus := _rect(pill, _tex(U + "ui-icon-mais.webp"), Vector2(cw * 0.935 - pi, ch * 0.5 - pi / 2.0), Vector2(pi, pi))
	var pb := _invisible_button(pill, Vector2(pi * 1.6, pi * 1.6))
	pb.position = plus.position - Vector2(pi * 0.3, pi * 0.3)
	pb.pressed.connect(func(): _show_coming_soon("Loja de Coroas", "Em breve você vai poder comprar Coroas aqui para trocar por boosters e eventos."))


# ---------------------------------------------------------------- botões do menu

func _build_cards() -> void:
	var cw := minf(W * 0.88, 343.0)
	var chh := cw * 397.0 / 1600.0
	var x := (W - cw) / 2.0
	# Começa depois do logo (88 + 4 + altura do logo + 16 de respiro)
	var logo_tex := _tex(A + "logo-price-of-war.webp")
	var lw := minf(W * 0.54, 215.0)
	var y := 88.0 + 4.0 + lw * logo_tex.get_height() / logo_tex.get_width() + 16.0
	var items := [
		["DESAFIOS", "menu-card-desafios", "ui-icon-desafios", "Desafios", "Em breve: enfrente os comandantes do reino."],
		["ONLINE", "menu-card-online", "ui-icon-online", "Online", "Os duelos contra outros jogadores (casual e ranqueado) ainda estão por vir."],
		["MEU DECK", "menu-card-editar-deck", "ui-icon-editar-deck", "Meu Deck", "Em breve você vai poder montar e ajustar o seu baralho aqui."],
		["LOJA", "menu-card-loja", "ui-icon-loja", "Loja", "Em breve você vai poder comprar boosters e Coroas aqui."],
	]
	for it in items:
		_make_card(Vector2(x, y), Vector2(cw, chh), it[0], U + it[1] + ".webp", U + it[2] + ".webp", it[3], it[4])
		y += chh + 12.0


func _make_card(pos: Vector2, sz: Vector2, title: String, bg_path: String, icon_path: String, popup_title: String, popup_msg: String) -> void:
	var card := Control.new()
	card.position = pos
	card.size = sz
	add_child(card)
	_rect(card, _tex(bg_path), Vector2.ZERO, sz)
	# Escurece a esquerda, onde ficam o ícone e o título.
	var grad := Gradient.new()
	grad.offsets = PackedFloat32Array([0.0, 0.45, 0.75])
	grad.colors = PackedColorArray([Color(0, 0, 0, 0.78), Color(0, 0, 0, 0.4), Color(0, 0, 0, 0.0)])
	var gt := GradientTexture2D.new()
	gt.gradient = grad
	gt.fill_from = Vector2(0, 0)
	gt.fill_to = Vector2(1, 0)
	gt.width = 256
	gt.height = 4
	_rect(card, gt, Vector2.ZERO, sz)
	_rect(card, _tex(U + "ui-frame-menu-card.webp"), Vector2.ZERO, sz)
	var isz := sz.x * 0.09
	_rect(card, _tex(icon_path), Vector2(sz.x * 0.065, (sz.y - isz) / 2.0), Vector2(isz, isz))
	_label(card, title, _spaced(CINZEL_DECO, 1), 15, Color("f3e3c3"),
		Vector2(sz.x * 0.065 + isz + sz.x * 0.025, 0), Vector2(sz.x * 0.6, sz.y))
	var btn := _invisible_button(card, sz)
	_press_effect(btn, card)
	btn.pressed.connect(func(): _show_coming_soon(popup_title, popup_msg))


func _build_bottom_row() -> void:
	var items := [["CONFIG.", "ui-icon-config", "Configurações", "Em breve."],
		["TUTORIAIS", "ui-icon-tutoriais", "Tutoriais", "Em breve."],
		["RANKING", "ui-icon-ranking", "Ranking", "O sistema de partidas ranqueadas ainda está por vir."],
		["SOM", "ui-icon-som", "Som", "Em breve."]]
	var bs := 56.0
	var gap := 24.0
	var total := bs * 4.0 + gap * 3.0
	var x := (W - total) / 2.0
	var y := H - 14.0 - bs - 16.0
	for it in items:
		var holder := Control.new()
		holder.position = Vector2(x, y)
		holder.size = Vector2(bs, bs)
		add_child(holder)
		_rect(holder, _tex(U + "ui-icon-button.webp"), Vector2.ZERO, holder.size)
		var isz := bs * 0.62
		_rect(holder, _tex(U + it[1] + ".webp"), Vector2((bs - isz) / 2.0, (bs - isz) / 2.0), Vector2(isz, isz))
		_label(self, it[0], _spaced(CINZEL, 1), 9, Color("f0e0bb"), Vector2(x - gap / 2.0, y + bs + 2.0), Vector2(bs + gap, 14.0), HORIZONTAL_ALIGNMENT_CENTER)
		var btn := _invisible_button(holder, holder.size)
		_press_effect(btn, holder)
		btn.pressed.connect(func(): _show_coming_soon(it[2], it[3]))
		x += bs + gap


# ---------------------------------------------------------------- janelas (modais)

func _close_modal() -> void:
	if modal:
		modal.queue_free()
		modal = null


func _open_modal_shell() -> Control:
	_close_modal()
	modal = Control.new()
	modal.set_anchors_preset(Control.PRESET_FULL_RECT)
	modal.mouse_filter = Control.MOUSE_FILTER_STOP
	add_child(modal)
	var dim := ColorRect.new()
	dim.color = Color(0, 0, 0, 0.8)
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	dim.mouse_filter = Control.MOUSE_FILTER_IGNORE
	modal.add_child(dim)
	modal.gui_input.connect(func(e: InputEvent):
		if e is InputEventMouseButton and e.pressed:
			_close_modal())
	return modal


func _panel_style() -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color("d9c9a3")
	sb.border_color = Color("5c4a30")
	sb.set_border_width_all(2)
	sb.set_corner_radius_all(16)
	sb.set_content_margin_all(22)
	return sb


func _dark_button(text: String) -> Button:
	var b := Button.new()
	b.text = text
	b.focus_mode = Control.FOCUS_NONE
	b.add_theme_font_override("font", CINZEL)
	b.add_theme_font_size_override("font_size", 14)
	b.add_theme_color_override("font_color", Color("4a3b2c"))
	b.add_theme_color_override("font_hover_color", Color("2a2117"))
	b.add_theme_color_override("font_pressed_color", Color("2a2117"))
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(0, 0, 0, 0)
	sb.border_color = Color("5c4a30")
	sb.set_border_width_all(2)
	sb.set_corner_radius_all(20)
	sb.content_margin_left = 22
	sb.content_margin_right = 22
	sb.content_margin_top = 8
	sb.content_margin_bottom = 8
	for state in ["normal", "hover", "pressed"]:
		b.add_theme_stylebox_override(state, sb)
	return b


func _show_coming_soon(title: String, message: String) -> void:
	var m := _open_modal_shell()
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", _panel_style())
	panel.custom_minimum_size = Vector2(minf(W - 48.0, 300.0), 0)
	m.add_child(panel)
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 12)
	panel.add_child(box)
	var t := Label.new()
	t.text = title.to_upper()
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	t.add_theme_font_override("font", CINZEL)
	t.add_theme_font_size_override("font_size", 18)
	t.add_theme_color_override("font_color", Color("2a2117"))
	box.add_child(t)
	var msg := Label.new()
	msg.text = message
	msg.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	msg.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	msg.add_theme_font_size_override("font_size", 14)
	msg.add_theme_color_override("font_color", Color("4a3b2c"))
	box.add_child(msg)
	var close := _dark_button("Fechar")
	close.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	close.pressed.connect(_close_modal)
	box.add_child(close)
	await get_tree().process_frame
	panel.position = (Vector2(W, H) - panel.size) / 2.0


func _open_avatar_picker() -> void:
	var m := _open_modal_shell()
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", _panel_style())
	m.add_child(panel)
	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 14)
	panel.add_child(box)
	var t := Label.new()
	t.text = "ESCOLHA SEU AVATAR"
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	t.add_theme_font_override("font", CINZEL)
	t.add_theme_font_size_override("font_size", 18)
	t.add_theme_color_override("font_color", Color("2a2117"))
	box.add_child(t)
	var grid := GridContainer.new()
	grid.columns = 3
	grid.add_theme_constant_override("h_separation", 14)
	grid.add_theme_constant_override("v_separation", 14)
	box.add_child(grid)
	for i in AVATARS.size():
		var holder := Control.new()
		holder.custom_minimum_size = Vector2(72, 72)
		grid.add_child(holder)
		var img := _rect(holder, _tex(U + AVATARS[i] + ".webp"), Vector2.ZERO, Vector2(72, 72))
		var mat := ShaderMaterial.new()
		var sh := Shader.new()
		sh.code = CIRCLE_SHADER
		mat.shader = sh
		img.material = mat
		if i == profile["avatar"]:
			var ring := Panel.new()
			var rs := StyleBoxFlat.new()
			rs.bg_color = Color(0, 0, 0, 0)
			rs.border_color = Color("34d399")
			rs.set_border_width_all(3)
			rs.set_corner_radius_all(40)
			ring.add_theme_stylebox_override("panel", rs)
			ring.position = Vector2(-3, -3)
			ring.size = Vector2(78, 78)
			ring.mouse_filter = Control.MOUSE_FILTER_IGNORE
			holder.add_child(ring)
		var b := _invisible_button(holder, Vector2(72, 72))
		b.pressed.connect(func():
			profile["avatar"] = i
			avatar_rect.texture = _tex(U + AVATARS[i] + ".webp")
			_save_profile()
			_close_modal())
	var close := _dark_button("Fechar")
	close.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	close.pressed.connect(_close_modal)
	box.add_child(close)
	await get_tree().process_frame
	panel.position = (Vector2(W, H) - panel.size) / 2.0
