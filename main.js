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

  sliderBall.onmousedown = (event) => {
    event.preventDefault();
    const width = slider.getBoundingClientRect().width;
    const x_0 = slider.getBoundingClientRect().left;
    const k = (+max - +min) / (width - 20);

    const shiftX = event.clientX - sliderBall.getBoundingClientRect().left;

    document.onmousemove = (event) => {
      const S = event.clientX - shiftX - x_0;
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
      result();
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
});

sliders.forEach((slider) => {
  const sliderBall = slider.querySelector(".slider__ball");
  const sliderLine = slider.querySelector(".slider__line");
  const input = document.getElementById(slider.dataset.id);
  const min = slider.dataset.min;
  const max = slider.dataset.max;
  const measurement = document.body.querySelector(slider.dataset.measurement);

  sliderBall.ontouchstart = (event) => {
    const width = slider.getBoundingClientRect().width;
    const x_0 = slider.getBoundingClientRect().left;
    const k = (+max - +min) / (width - 20);

    const shiftX =
      event.changedTouches[0].clientX - sliderBall.getBoundingClientRect().left;

    document.ontouchmove = (event) => {
      const S = event.changedTouches[0].clientX - shiftX - x_0;
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
      result();
    };
    document.ontouchend = () => {
      document.ontouchmove = null;
      document.ontouchend = null;
    };
  };
});

submit.onclick = () => {
  const [sum, monthlyPayment] = document.body.querySelectorAll(
    ".form__amount-lease>div"
  );

  const data = {
    monthPay: parseInt(monthlyPayment.textContent),
    sum: parseInt(sum.textContent),
    price: price.value,
    initial: parseInt(initial_payment.value),
    months: limit.value,
  };
    submit.innerHTML =
      '<img class="form__submit_anim" src="./img/Ellipse.svg" alt="">';
    submit.disabled = true;
    fetch("https://eoj3r7f3r4ef6v4.m.pipedream.net", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) alert("Успешно отправлены данные");
        else {
          console.log(res)
          throw new Error(`Error ${res.status}`);
        }
      })
      .catch((err) => alert(err.message))
      .finally(() => {
        submit.innerHTML = "Оставить заявку";
        submit.disabled = false;
      });
};

price.oninput = (e) => {
  price.value = e.target.value.replace(/[^\d.]/g, "");
  const slider = sliders[0];
  const sliderBall = slider.querySelector(".slider__ball");
  const sliderLine = slider.querySelector(".slider__line");
  const width = slider.getBoundingClientRect().width;
  if (+e.target.value > 1000000 && +e.target.value < 6000000) {
    const min = slider.dataset.min;
    const max = slider.dataset.max;
    const proportion = ((parseInt(price.value) - +min) / (+max - +min)) * 100;
    if(+e.target.value - 1000000 >= 6000000 - +e.target.value) {
      sliderBall.style.left = `calc(${proportion}% - 20px)`;
      sliderLine.style.width = `calc(${proportion}% - 20px)`;
    } else {
      sliderBall.style.left = `${proportion}%`;
      sliderLine.style.width = `${proportion}%`;
    }
    result();
  }
  if (+e.target.value <= 1000000) {
    sliderBall.style.left = "0%";
    sliderLine.style.width = "0%";
  }
  if (+e.target.value >= 6000000) {
    sliderBall.style.left = `${(100 * (width - 20)) / width}%`;
    sliderLine.style.width = `${(100 * (width - 20)) / width}%`;
  }
};

price.onblur = (e) => {
    if(+e.target.value <= 1000000) price.value = 1000000
    if(+e.target.value >= 6000000) price.value = 6000000
    result();
}

initial_payment.onfocus = (e) => {
    const slider = sliders[1];
    const measurement = document.body.querySelector(slider.dataset.measurement);
    initial_payment.value = parseInt(measurement.textContent)
}

initial_payment.oninput = (e) => {
    initial_payment.value = e.target.value.replace(/[^\d.]/g, "");
    const slider = sliders[1];
    const sliderBall = slider.querySelector(".slider__ball");
    const sliderLine = slider.querySelector(".slider__line");
    const measurement = document.body.querySelector(slider.dataset.measurement);
    const width = slider.getBoundingClientRect().width;
    if (+e.target.value > 10 && +e.target.value < 60) {
        measurement.innerHTML = `${initial_payment.value}%`
      const min = slider.dataset.min;
      const max = slider.dataset.max;
      const proportion = ((parseInt(initial_payment.value) - +min) / (+max - +min)) * 100;
      if(+e.target.value - 10 >= 60 - +e.target.value) {
        sliderBall.style.left = `calc(${proportion}% - 20px)`;
        sliderLine.style.width = `calc(${proportion}% - 20px)`;
      } else {
        sliderBall.style.left = `${proportion}%`;
        sliderLine.style.width = `${proportion}%`;
      }
    }
    if (+e.target.value <= 10) {
      sliderBall.style.left = "0%";
      sliderLine.style.width = "0%";
      measurement.innerHTML = '10%'
    }
    if (+e.target.value >= 60) {
      sliderBall.style.left = `${(100 * (width - 20)) / width}%`;
      sliderLine.style.width = `${(100 * (width - 20)) / width}%`;
      measurement.innerHTML = '60%'
    }
  };

initial_payment.onblur = (e) => {
    if(+e.target.value <= 10) {
      initial_payment.value = (0.1 * parseInt(price.value)).toFixed(1) + ' ₽'
    } else if(+e.target.value >= 60) {
      initial_payment.value = (0.6 * parseInt(price.value)).toFixed(1) + ' ₽'
    } else {
      initial_payment.value = (+e.target.value * parseInt(price.value)).toFixed(1) + ' ₽'
    }
    result();
}

limit.oninput = (e) => {
  limit.value = e.target.value.replace(/[^\d.]/g, "");
  const slider = sliders[2];
  const sliderBall = slider.querySelector(".slider__ball");
  const sliderLine = slider.querySelector(".slider__line");
  const width = slider.getBoundingClientRect().width;
  if (+e.target.value > 1 && +e.target.value < 60) {
    const min = slider.dataset.min;
    const max = slider.dataset.max;
    const proportion = ((parseInt(limit.value) - +min) / (+max - +min)) * 100;
    if(+e.target.value - 1 >= 60 - +e.target.value) {
      sliderBall.style.left = `calc(${proportion}% - 20px)`;
      sliderLine.style.width = `calc(${proportion}% - 20px)`;
    } else {
      sliderBall.style.left = `${proportion}%`;
      sliderLine.style.width = `${proportion}%`;
    }
    result();
  }
  if (+e.target.value <= 1) {
    sliderBall.style.left = "0%";
    sliderLine.style.width = "0%";
  }
  if (+e.target.value >= 60) {
    sliderBall.style.left = `${(100 * (width - 20)) / width}%`;
    sliderLine.style.width = `${(100 * (width - 20)) / width}%`;
  }
};

limit.onblur = (e) => {
    if(+e.target.value <= 1) limit.value = 1
    if(+e.target.value >= 60) limit.value = 60
    result();
}

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
