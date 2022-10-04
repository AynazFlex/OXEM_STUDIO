const sliders = document.body.querySelectorAll(".slider");
const submit = document.body.querySelector(".form__submit");
const [sum, monthlyPayment] = document.body.querySelectorAll(
  ".form__amount-lease>div"
);
const measurementElem = document.body.querySelector(
  ".form__item-measurement_payment"
);


calculation(); // калькуляция

sliders.forEach((slider) => {
  // работа слайдеров для мыши
  sliderEngine(slider); // по умолчанию для мыши
  sliderEngine(slider, "mobile"); // для сенсора
});

submit.onclick = () => {
  const data = {
    monthly_payment_from: parseInt(monthlyPayment.textContent),
    sum: parseInt(sum.textContent),
    car_coast: price.value,
    initail_payment: parseInt(initial_payment.value),
    lease_term: limit.value,
    initail_payment_percent: parseInt(measurementElem.textContent),
  };
  submit.innerHTML =
    '<img class="form__submit_anim" src="./img/Ellipse.svg" alt="">';
  submit.disabled = true;
  fetch("https://hookb.in/eK160jgYJ6UlaRPldJ1P", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.ok) alert("Успешно отправлены данные");
      else {
        throw new Error(`Error ${res.status}`);
      }
    })
    .catch((err) => alert(err.message))
    .finally(() => {
      submit.innerHTML = "Оставить заявку";
      submit.disabled = false;
    });
};

price.oninput = inputEventOninput(0)

price.onblur = inputEventOnblur(0)

initial_payment.onfocus = (e) => {
  const slider = sliders[1];
  const measurement = document.body.querySelector(slider.dataset.measurement);
  initial_payment.value = parseInt(measurement.textContent);
};

initial_payment.oninput = (e) => { // для процента
  initial_payment.value = e.target.value.replace(/[^\d.]/g, "");
  const slider = sliders[1];
  const sliderBall = slider.querySelector(".slider__ball");
  const sliderLine = slider.querySelector(".slider__line");
  const measurement = document.body.querySelector(slider.dataset.measurement);
  const width = slider.getBoundingClientRect().width;
  const min = slider.dataset.min;
  const max = slider.dataset.max;
  if (+e.target.value > +min && +e.target.value < +max) {
    measurement.innerHTML = `${initial_payment.value}%`;
    const proportion =
      ((parseInt(initial_payment.value) - +min) / (+max - +min)) * 100;
    if (+e.target.value - +min >= +max - +e.target.value) {
      sliderBall.style.left = `calc(${proportion}% - 20px)`;
      sliderLine.style.width = `calc(${proportion}% - 20px)`;
    } else {
      sliderBall.style.left = `${proportion}%`;
      sliderLine.style.width = `${proportion}%`;
    }
  }
  if (+e.target.value <= +min) {
    sliderBall.style.left = "0%";
    sliderLine.style.width = "0%";
    measurement.innerHTML = min + "%";
  }
  if (+e.target.value >= +max) {
    sliderBall.style.left = `${(100 * (width - 20)) / width}%`;
    sliderLine.style.width = `${(100 * (width - 20)) / width}%`;
    measurement.innerHTML = max + "%";
  }
};

initial_payment.onblur = (e) => { // для процента
  const min = sliders[1].dataset.min;
  const max = sliders[1].dataset.max;
  if (+e.target.value <= -min) {
    initial_payment.value = (0.1 * parseInt(price.value)).toFixed(1) + " ₽";
  } else if (+e.target.value >= +max) {
    initial_payment.value = (0.6 * parseInt(price.value)).toFixed(1) + " ₽";
  } else {
    initial_payment.value =
      (+e.target.value * parseInt(price.value)).toFixed(1) + " ₽";
  }
  calculation()
};

limit.oninput = inputEventOninput(2)

limit.onblur = inputEventOnblur(2)

function calculation() {
  //функция для вычислений
    const percentage = parseInt(measurementElem.textContent) / 100;
    const initial = +(percentage * price.value).toFixed(1);
    initial_payment.value = `${initial} ₽`;
    const monthPay = (
      (+price.value - initial) *
      ((0.035 * Math.pow(1 + 0.035, +limit.value)) /
        (Math.pow(1 + 0.035, +limit.value) - 1))
    ).toFixed(1);
    monthlyPayment.textContent = `${monthPay} ₽`;
    sum.textContent = `${(initial + +limit.value * monthPay).toFixed(1)} ₽`;
}

function sliderEngine(slider, device = "mouse") {
  // логика для работы слайдера
  const sliderBall = slider.querySelector(".slider__ball");
  const sliderLine = slider.querySelector(".slider__line");
  const input = document.getElementById(slider.dataset.id);
  const min = slider.dataset.min;
  const max = slider.dataset.max;
  const measurement = document.body.querySelector(slider.dataset.measurement);

  sliderBall[`${device === "mobile" ? "ontouchstart" : "onmousedown"}`] = (
    event
  ) => {
    event.preventDefault();
    const width = slider.getBoundingClientRect().width;
    const x_0 = slider.getBoundingClientRect().left;
    const k = (+max - +min) / (width - 20);

    const startX =
      device === "mobile" ? event.changedTouches[0].clientX : event.clientX;

    const shiftX = startX - sliderBall.getBoundingClientRect().left;

    document[`${device === "mobile" ? "ontouchmove" : "onmousemove"}`] = (
      event
    ) => {
      const moveX =
        device === "mobile" ? event.changedTouches[0].clientX : event.clientX;
      const S = moveX - shiftX - x_0;
      const proportion = (S / width) * 100;
      if (S <= 0) {
        sliderBall.style.left = "0%";
        sliderLine.style.width = "0%";
        if (measurement) {
          measurement.innerHTML = `${min}%`;
        } else {
          input.value = min;
        }
      } else if (S + 20 >= width) {
        sliderBall.style.left = `${(100 * (width - 20)) / width}%`;
        sliderLine.style.width = `${(100 * (width - 20)) / width}%`;
        if (measurement) {
          measurement.innerHTML = `${max}%`;
        } else {
          input.value = max;
        }
      } else {
        sliderBall.style.left = `${proportion}%`;
        sliderLine.style.width = `${proportion}%`;
        if (measurement) {
          measurement.innerHTML = `${Math.floor(k * S + +min)}%`;
        } else {
          input.value = Math.floor(k * S + +min);
        }
      }
      calculation()
    };
    document[`${device === "mobile" ? "ontouchend" : "onmouseup"}`] = () => {
      document[`${device === "mobile" ? "ontouchmove" : "onmousemove"}`] = null;
      document[`${device === "mobile" ? "ontouchend" : "onmouseup"}`] = null;
    };
  };
}

function inputEventOninput(sliderIndex) { // функция для события input
  return function (e) {
    this.value = e.target.value.replace(/[^\d.]/g, "");
    const slider = sliders[sliderIndex];
    const sliderBall = slider.querySelector(".slider__ball");
    const sliderLine = slider.querySelector(".slider__line");
    const width = slider.getBoundingClientRect().width;
    const min = slider.dataset.min;
    const max = slider.dataset.max;
    if (+e.target.value > +min && +e.target.value < +max) {
      const proportion = ((parseInt(this.value) - +min) / (+max - +min)) * 100;
      if (+e.target.value - +min >= +max - +e.target.value) {
        sliderBall.style.left = `calc(${proportion}% - 20px)`;
        sliderLine.style.width = `calc(${proportion}% - 20px)`;
      } else {
        sliderBall.style.left = `${proportion}%`;
        sliderLine.style.width = `${proportion}%`;
      }
      calculation()
    }
    if (+e.target.value <= +min) {
      sliderBall.style.left = "0%";
      sliderLine.style.width = "0%";
    }
    if (+e.target.value >= +max) {
      sliderBall.style.left = `${(100 * (width - 20)) / width}%`;
      sliderLine.style.width = `${(100 * (width - 20)) / width}%`;
    }
  };
}

function inputEventOnblur(sliderIndex) { // функция для события blur
  return function(e) {
    const min = sliders[sliderIndex].dataset.min;
    const max = sliders[sliderIndex].dataset.max;
    if (+e.target.value <= +min) this.value = min;
    if (+e.target.value >= +max) this.value = max;
    calculation()
  }
}