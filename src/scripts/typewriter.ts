import Typewriter from "typewriter-effect/dist/core";
import { PowerGlitch } from "powerglitch";

if (document.getElementById("typewriter-canvas")) {
  //TODO: use Intersection Observer API to turnoff animation
  const defaultDelay = 30;
  const systemDelay = 20;
  const slowerDelay = 50;
  const glitchedDelay = 100;
  const shortPause = 500;
  const normalPause = 1000;
  const systemPause = 2000;
  const longPause = 5000;
  const glitchFrequency = 1000;

  const typewriter = new Typewriter("#typewriter-canvas", {
    loop: true,
    delay: defaultDelay,
    cursor: "█",
  });

  let endLastGlitch = null;
  const createGlitch = () => {
    const { startGlitch, stopGlitch, containers } = PowerGlitch.glitch(
      "#typewriter-canvas",
      {
        timing: {
          duration: glitchFrequency,
          easing: "ease-in-out",
        },
        //createContainers: false
      }
    );

    endLastGlitch = () => {
      stopGlitch();
      const container = containers[0]; // the layer container
      const originalContent = container.firstChild.firstChild;
      const parentElement = container.parentElement;
      container.remove();
      parentElement.appendChild(originalContent);
    };

    startGlitch();
  };

  typewriter.terminal = ({
    name = "terminal",
    delay = systemDelay,
    pause = systemPause,
    exitDelay = defaultDelay,
  } = {}) =>
    typewriter
      .changeDelay(delay)
      .typeString(`[ ${name} ]: `)
      .changeDelay(exitDelay)
      .pauseFor(pause);

  typewriter.loading = ({
    delay = slowerDelay,
    exitDelay = defaultDelay,
  } = {}) =>
    typewriter
      .changeDelay(delay)
      .typeString("...")
      .deleteChars(3)
      .typeString("...")
      .deleteChars(3)
      .typeString("...")
      .deleteChars(3)
      .typeString("... <span style='color: hsl(var(--su));'>DONE</span><br/>")
      .changeDelay(exitDelay);

  typewriter
    .callFunction(() => endLastGlitch && endLastGlitch())
    .pauseFor(normalPause)
    .terminal()
    .typeString("booting")
    .loading()
    .terminal({ name: "kernel" })
    .pauseFor(shortPause)
    .typeString(
      "<span style='color: hsl(var(--in));'>system starting</span><br/>"
    )
    .pauseFor(normalPause)
    .typeString("--------------------------------<br/>")
    .pauseFor(shortPause)
    .changeDelay(slowerDelay)
    .typeString(
      "<span class='text-3xl font-bold'>Hello there !</span><br/><br/>"
    )
    .changeDelay(defaultDelay)
    .pauseFor(normalPause)
    .terminal({ name: "kernel" })
    .pauseFor(shortPause)
    .typeString("Hi 👋🏻 I'm Majed, and this is my blog.<br/>")
    .pauseFor(normalPause)
    .terminal({ name: "kernel" })
    .typeString(
      "Here, I share my experiences and interests about the web, code challenges and CTFs.<br/>"
    )
    .pauseFor(normalPause)
    .terminal({ name: "kernel" })
    .pauseFor(shortPause)
    .typeString("Be")
    .callFunction(createGlitch)
    .changeDelay(glitchedDelay)
    .typeString(" w e l c o m e<br/>")
    .pauseFor(shortPause)
    .typeString(
      "<span style='color: hsl(var(--er));'>s e g m e n t a t i o n 陰位ド</span><br/>"
    )
    .pauseFor(2 * longPause)
    .deleteAll(10)
    .terminal({
      name: "終端",
      delay: glitchedDelay,
      exitDelay: glitchedDelay,
      pause: 0,
    })
    .typeString("<span style='color: hsl(var(--er));'>再起動中</span><br/>")
    .pauseFor(5000)
    .start();
}
