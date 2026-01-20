function decodificaHorario(horario) {
  const regex = /(\d+)([MTN])(d+)/;
  const match = horario.match(regex);

  if (!match) {
    return [];
  }

  const dias = match[1].split("");

  const turno = match[2];

  const hora = match[3].split("");

  let posicao = [];

  dias.forEach(dias => {
    hora.forEach(hora => {
        posicao.push({
            coluna: dias - 1,
        linha: [turno, hora]
        });
    });
  });

  return posicao;
}

function desenharHorario()

function gerarGrade() {
  const tbody = document.getElementById("grid-body");
  const horas = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00", // Fim do turno da Manhã
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00", // Fim do turno Tarde
    "19:00",
    "20:00",
    "21:00",
    "22:00", // Fim do turno da Noite
  ];

  horas.forEach((hora, indexLinha) => {
    const tr = document.createElement("tr");

    // Coluna da hora
    tr.innerHTML = `<td>${hora}</td>`;
    if (hora == "12:00" || hora == "18:00") {
      tr.classList.add("divisorDeTurno");
    }

    // Criar 7 colunas para os dias (Dom-Sáb)
    for (let indexColuna = 0; indexColuna < 7; indexColuna++) {
      const td = document.createElement("td");
      td.id = `cell-${indexLinha}-${indexColuna}`;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });
}

// Gera a tabela dos horarios
window.onload = () => {
  gerarGrade();
};
