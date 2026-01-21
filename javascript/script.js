// Lista de materias de computacao para teste de desenho das materias
// JSON com
const bancoDados = {
  "Ciência da Computação": [
    {
      id: 1,
      nome: "Cálculo Diferencial e Integral I",
      horario: "24T3456",
      professor: "Paulo Alexandre",
    },
    {
      id: 2,
      nome: "Informática e Sociedade",
      horario: "24T56",
      professor: "Weslley Emmanuel",
    },
    {
      id: 3,
      nome: "Inglês Técnico e Científico",
      horario: "24M34",
      professor: "Francisco Wellington",
    },
    {
      id: 4,
      nome: "Introdução à Lógica",
      horario: "35M56",
      professor: "Kelson Romulo",
    },
    {
      id: 5,
      nome: "Introdução à Metodologia Científica",
      horario: "24M67",
      professor: "Atila Brandão",
    },
    {
      id: 6,
      nome: "Programação Estruturada",
      horario: "35M56",
      professor: "Rosianni de Oliveira",
    },
    {
      id: 7,
      nome: "Matematica Discreta",
      horario: "24N12",
      professor: "Josias",
    },
  ],
};
// prettier-ignore
const turnoHorario = {
  M: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 , 7: 6},
  T: { 1: 6, 2: 7, 3: 8, 4: 9, 5: 10, 6: 11 },
  N: { 1: 12, 2: 13, 3: 14, 4: 15 }
};

const paletaCores = [
  "#4A90E2",
  "#a80536",
  "#F5A623",
  "#e465e9",
  "#8B572A",
  "#7ED321",
  "#BD10E0",
  "#9013FE",
  "#417505",
  "#F8E71C",
];

let indiceCor = 0;

// Objeto para guardar as cores das matérias que já estão na grade
const coresAtribuidas = {};

function gerarGrade() {
  const tbody = document.getElementById("grid-body");
  const horas = [
    "06:00",
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

function decodificaHorario(horario) {
  const regex = /(\d+)([MTN])(\d+)/;
  const match = horario.match(regex);

  if (!match) {
    return [];
  }

  const dias = match[1].split("");

  const turno = match[2];

  const horas = match[3].split("");

  let posicao = [];

  dias.forEach((dia) => {
    horas.forEach((hora) => {
      let indexX = dia - 1;
      let indexY = turnoHorario[turno][parseInt([hora])]; // Define com o turno e hora, o numero da linha na tabela

      posicao.push({
        coluna: indexY,
        linha: indexX,
      });
    });
  });

  return posicao; // retorna um dict com o x e y da materia
}

function desenhaMateria(posicao, nome, cores) {
  posicao.forEach((posicoes) => {
    const id = `cell-${posicoes.coluna}-${posicoes.linha}`;
    const celula = document.getElementById(id);
    if (celula) {
      celula.style.background = cores[nome];
      celula.textContent = nome;
      // Adiciona uma classe geral para saber que está ocupada
      celula.classList.add("celula-ocupada");
      return true;
    } else {
      console.log("Deu merda");
      return false;
    }
  });
}

function corMateriaAtual(indice) {
  cor = paletaCores[indiceCor];
  indiceCor++;
  return cor;
}

function apagaMateria(posicao) {
  posicao.forEach((posicoes) => {
    const id = `cell-${posicoes.coluna}-${posicoes.linha}`;
    const celula = document.getElementById(id);
    if (celula) {
      celula.innerText = "";
      celula.style.backgroundColor = "";
      celula.classList.remove("celula-ocupada");
      celula.removeAttribute("data-materia-nome");
      if (indiceCor > 0) {
        indiceCor--;
      }
    }
  });
}

function carregarCursoEscolhido() {
  const selectedCurso = document.getElementById("curso-select");

  const listaContainer = document.querySelector(".lista-materias");

  listaContainer.innerHTML = "";
  if (!listaContainer) return; // Segurança caso o container não exista na página

  const cursoAtual = selectedCurso.value;

  if (cursoAtual) {
    carregaListaMaterias(cursoAtual);
    console.log("Deu certo");
  } else {
    console.log("Deu merda");
  }
}

function carregaListaMaterias(curso) {
  const listaContainer = document.querySelector(".lista-materias");
  listaContainer.innerHTML = "";

  const materias = bancoDados[curso];

  materias.forEach((materia) => {
    const div = document.createElement("div");
    div.className = "item-materia";
    div.innerHTML = ` 
    <label>
      <input type="checkbox" data-id="${materia.id}" class="checkbox-materia"
      onchange="toggleMateria(event)">
      <span>${materia.nome}</span>
      <small>${materia.horario} - ${materia.professor}</small>
    </label>`;

    listaContainer.appendChild(div);
    // No seu loop que cria a lista de matérias:
  });
}

function toggleMateria(event) {
  // Pegar os dados da matéria clicada
  // Aqui nós pegamos o 'relatório' e perguntamos: 'Quem foi que mudou?'
  const checkboxClicado = event.target;

  const idMateria = event.target.dataset.id;
  const cursoAtual = document.getElementById("curso-select").value;

  console.log("Curso selecionado no HTML:", cursoAtual);
  console.log("Cursos disponíveis no JS:", Object.keys(bancoDados));

  // Busca a matéria pelo ID, independente da posição no array
  const info = bancoDados[cursoAtual].find((m) => m.id == idMateria);

  if (!cursoAtual || !bancoDados[cursoAtual]) {
    console.error("Curso não selecionado ou não encontrado no banco de dados!");
    this.checked = false; // Desmarca o checkbox para evitar erro visual
    return;
  }

  const posicao = decodificaHorario(info.horario);

  if (checkboxClicado.checked) {
    if (!coresAtribuidas[info.nome]) {
      coresAtribuidas[info.nome] = corMateriaAtual(indiceCor);
    }
    // Parametro para garantir que o toggle nao fique checkd se o desenho nao for bem sucedido
    let sucesso = desenhaMateria(posicao, info.nome, coresAtribuidas);
    console.log("Regex da materia carregado:" + info.horario);
  } else {
    apagaMateria(posicao);
  }
  const marcados = document.querySelectorAll(".checkbox-materia:checked");
  console.log("Selecionados agora:", marcados.length);
}

// Gera a tabela dos horarios
gerarGrade();

// 2. Monitora a mudança do curso
const seletor = document.getElementById("curso-select");
seletor.addEventListener("change", carregarCursoEscolhido);

// 3. Monitora cliques em checkboxes (mesmo os que ainda não foram criados)
document
  .querySelector(".lista-materias")
  .addEventListener("change", function (event) {
    // Verifica se o que mudou foi realmente um checkbox de matéria
    if (event.target.classList.contains("checkbox-materia")) {
      toggleMateria(event);
    }
  });

console.log("Sistema iniciado! Aguardando seleção de curso...");
