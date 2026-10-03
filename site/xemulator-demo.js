import { sock_init, sock_load_sprite, sock_draw, sock_render } from "./sock.js";

const width = 320;
const height = 240;

const screen = document.getElementById('screen');
sock_init(screen, width, height);

const img = new Image();
img.src = 'logo.png';
sock_load_sprite(img);

sock_draw(20);

