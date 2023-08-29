gsap.registerPlugin(ScrollTrigger);

const pageContainer = document.querySelector(".container");

/* SMOOTH SCROLL */
const scroller = new LocomotiveScroll({
  el: pageContainer,
  smooth: true
});

scroller.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(pageContainer, {
  scrollTop(value) {
    return arguments.length
      ? scroller.scrollTo(value, 0, 0)
      : scroller.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  pinType: pageContainer.style.transform ? "transform" : "fixed"
});

window.addEventListener("load", function () {
  let pinBoxes = document.querySelectorAll(".pin-wrap > *");
  let pinWrap = document.querySelector(".pin-wrap");
  let pinWrapWidth = pinWrap.offsetWidth;
  let horizontalScrollLength = pinWrapWidth - window.innerWidth;

  // Pinning and horizontal scrolling
  gsap.to(".pin-wrap", {
    scrollTrigger: {
      scroller: pageContainer, 
      scrub: true,
      trigger: "#sectionPin",
      pin: true,
      start: "top top",
      end: pinWrapWidth
    },
    x: -horizontalScrollLength,
    ease: "none"
  });

  ScrollTrigger.addEventListener("refresh", () => scroller.update());
  ScrollTrigger.refresh();
});

function actualizarTextoDinamico() {
  const valor01 = document.getElementById("valor01").innerText;
  const textoDinamico01 = document.querySelectorAll(".textoDinamico")[0]; 
  textoDinamico01.innerText = `Ya somos más de ${valor01} personas`;

  const valor02 = document.getElementById("valor02").innerText;
  const textoDinamico02 = document.querySelectorAll(".textoDinamico")[1]; 
  textoDinamico02.innerText = `Tenemos más de ${valor02}ha compradas`;
}

function valorAnimado(obj, inicio, fin, duracion, callback) {
  let tiempoInicio = null;
  const paso = (tiempo) => {
    if (!tiempoInicio) tiempoInicio = tiempo;
    const progreso = Math.min((tiempo - tiempoInicio) / duracion, 1);
    obj.innerHTML = Math.floor(progreso * (fin - inicio) + inicio);
    if (progreso < 1) {
      window.requestAnimationFrame(paso);
    } else if (callback) {
      callback();
    }
  };
  window.requestAnimationFrame(paso);
}

scroller.on("scroll", (instance) => {
    const scrollPosition = instance.scroll.y;
    const zonaDeseadaInicio = 500;
    const zonaDeseadaFin = 1000;
    if (scrollPosition >= zonaDeseadaInicio && scrollPosition <= zonaDeseadaFin) {
        const obj01 = document.getElementById("valor01");
        valorAnimado(obj01, 0, 1500, 1500, actualizarTextoDinamico);

        const obj02 = document.getElementById("valor02");
        valorAnimado(obj02, 0, 300, 1500, actualizarTextoDinamico);

        // Detener el evento para que no se vuelva a ejecutar
        scroller.off("scroll");
    }
});