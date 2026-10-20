// SOCK Emulator
// Noah Azzaria-Byrne

var width = 0;
var height = 0;
var ctx: CanvasRenderingContext2D;
const loading_canvas = document.createElement("canvas");
const loading_ctx = loading_canvas.getContext("2d")!;
// loading_ctx.imageSmoothingEnabled = false;
loading_canvas.id = "loading-canvas";

const cache: (ImageBitmap | null)[] = [];
var draw_queue: Draw[] = [];

function sock_init(screen: HTMLCanvasElement, w: number, h: number) {
  console.log("Initializing SOCK...");

  width = w;
  height = h;
  ctx = screen.getContext("2d")!;
  // ctx.imageSmoothingEnabled = false;

  screen.width = width;
  screen.height = height;

  // clear_screen();
}

function clear_screen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
}

function sock_load_sprite(filename: string): number {
  const idx = cache.length;
  const sprite = new Image();
  sprite.src = filename;

  sprite.addEventListener("load", () => {
    loading_canvas.width = sprite.width;
    loading_canvas.height = sprite.height;

    loading_ctx.drawImage(sprite, 0, 0);
    const imgData = loading_ctx.getImageData(0, 0, sprite.width, sprite.height);

    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const converted_color = convert_color([
        data[i],
        data[i + 1],
        data[i + 2],
        data[i + 3],
      ]);

      // const converted_color = [0, 0, 0, 255];
      data[i] = converted_color[0];
      data[i + 1] = converted_color[1];
      data[i + 2] = converted_color[2];
      data[i + 3] = converted_color[3];
    }
    createImageBitmap(imgData).then((bmp) => {
      cache[idx] = bmp;
    });
  });
  cache.push(null);
  return idx; // would be -1, but img not loaded, rly need a nicer way than callbacks
}

/**
 *
 * @param rgba raw image values
 * @returns converted to 5542 encoding (sort of)
 */
function convert_color(
  rgba: [number, number, number, number],
): [number, number, number, number] {
  // RGBA: 5542
  const r = Math.round(rgba[0] / 8) * 8;
  const g = Math.round(rgba[1] / 8) * 8;
  const b = Math.round(rgba[2] / 16) * 16;
  const a = Math.round(rgba[3] / 64) * 64;
  return [r, g, b, a];
}

/**
 * @param draw
 */
function sock_draw(draw: Draw) {
  draw_queue.push(draw);
}

async function sock_render() {
  // Make sure all sprites are loaded
  if (cache.filter((sprite) => sprite == null).length > 0) {
    console.log("Stalling until textures load...");
    setTimeout(() => {
      sock_render();
    }, 10);
    return;
  }

  clear_screen();
  for (let i = 0; i < draw_queue.length; i++) {
    const draw = draw_queue[i];
    const sprite = cache[draw.sprite]!;
    ctx.drawImage(
      sprite,
      draw.transform.position[0],
      draw.transform.position[1],
      sprite.width * draw.transform.scale,
      sprite.height * draw.transform.scale,
    );
  }
  draw_queue = [];
}

type Draw = {
  sprite: number;
  transform: Transform;
};

type Transform = {
  position: [number, number];
  scale: number;
};

export { sock_init, sock_load_sprite, sock_draw, sock_render };
