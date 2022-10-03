const sliders = document.body.querySelectorAll(".slider");
const submit = document.body.querySelector(".form__submit");

const result = calculation();
result();


sliders.forEach((slider) => {
  const sliderBall = slider.querySelector(".slider__ball");
  const sliderLine = slider.querySelector(".slider__line");
  const input = document.getElementById(slider.dataset.id);
  const min = slider.dataset.min;
  const max = slider.dataset.max;
  const measurement = document.body.querySelector(slider.dataset.measurement);

  sliderBall.onpointerdown = (event) => {
    event.preventDefault();
    const width = slider.getBoundingClientRect().width;
    const x_0 = slider.getBoundingClientRect().left;
    const k = (+max - +min) / (width - 20);

    const shiftX = event.clientX - sliderBall.getBoundingClientRect().left;

    sliderBall.setPointerCapture(event.pointerId);

    sliderBall.onpointermove = (event) => {
      const S = event.clientX - shiftX - x_0;
      const proportion = (S/width)*100;
      if (S <= 0) {
        sliderBall.style.left = "0%";
        sliderLine.style.width = "0%";
        if (measurement) {
          measurement.innerHTML = `${min}%`;
        } else {
          input.value = min;
        }
      } else if (S + 20 >= width) {
        sliderBall.style.left = `${100*(width - 20)/width}%`;
        sliderLine.style.width = `${100*(width - 20)/width}%`;
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
      result();
    };
    document.onpointerup = () => {
      sliderBall.onpointermove = null;
      document.onpointerup = null;
    };
  };
});

function calculation() {
  const measurementElem = document.body.querySelector(
    ".form__item-measurement_payment"
  );
  const [sum, monthlyPayment] = document.body.querySelectorAll(
    ".form__amount-lease>div"
  );

  return () => {
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
  };
}

submit.onclick = () => {
  const [sum, monthlyPayment] = document.body.querySelectorAll(
    ".form__amount-lease>div"
  );
  submit.innerHTML = '<img class="form__submit_anim" src="./img/Ellipse.svg" alt="">'
  submit.disabled = true
  
  const data = {
    monthPay: parseInt(monthlyPayment.textContent),
    sum: parseInt(sum.textContent),
    price: price.value,
    initial: parseInt(initial_payment.value),
    months: limit.value,
  };
  
  fetch("https://eoj3r7f3r4ef6v4.m.pipedream.net", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.ok) alert('Успешно отправлены данные');
      else throw new Error(`Error ${res.status}`);
    })
    .catch((err) => alert(err.message))
    .finally(() => {
        submit.innerHTML = 'Оставить заявку'
        submit.disabled = false
    });
};

price.onchange = (e) => {
    
}

/*sliderBall.addEventListener("pointerdown", (e) => {
    sliderBall.setPointerCapture(e.pointerId);
    console.log(e.pointerId)
    const width = slider.getBoundingClientRect().width;
    const x_0 = slider.getBoundingClientRect().left;
    document.onpointermove = (e) => {
      e.preventDefault();
      const S = e.clientX - slider.getBoundingClientRect().left;
      if (S <= 0) {
        sliderBall.style.left = "0px";
        sliderLine.style.width = "0px";
        input.value = 0;
      } else if (S + 20 >= width) {
        sliderBall.style.left = `${width - 20}px`;
        sliderLine.style.width = "calc(100% - 20px)";
        input.value = width - 20;
      } else {
        const d_x = e.clientX - x_0;
        sliderBall.style.left = `${d_x}px`;
        sliderLine.style.width = `${d_x}px`;
        input.value = d_x;
      }
    };
    document.addEventListener(
      "pointerup",
      () => {
        document.onpointermove = null;
      },
      { once: true }
    );
  });*/
