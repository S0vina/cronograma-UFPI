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
    {
      id: 8,
      nome: "Progamacao Estruturada",
      horario: "24T56",
      professor: "Pedrao",
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

let celulasOcupadas = {};

let materiasAtivas = []; // Array para guardar os objetos das matérias marcadas

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

function desenhaMateria(posicao, nome, cor) {
  posicao.forEach((posicoes) => {
    const id = `cell-${posicoes.coluna}-${posicoes.linha}`;
    const celula = document.getElementById(id);
    if (celula) {
      const materiaExistente = celulasOcupadas[id];
      console.log(materiaExistente);
      if (materiaExistente && materiaExistente !== nome) {
        exibirConflito(celula, materiaExistente, nome);
        console.log("cheguei aqui");
        // } else if (celula.classList.contains("conflito-ativo")) {
        // return;
      } else {
        // Se a célula já estava com conflito mas agora estou sozinho nela
        // (Isso acontece durante o redesenho após desmarcar uma)
        celula.classList.remove("conflito-ativo");

        celula.style.backgroundColor = cor;
        celula.innerHTML = `<span>${nome}</span>`;
        celula.classList.add("ocupada");
        celulasOcupadas[id] = nome;
        console.log(celulasOcupadas[id]);
      }
    } else {
      console.log("Deu merda");
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
      delete celulasOcupadas[id];
      if (indiceCor > 0) {
        indiceCor--;
      }
    }
  });
}

function exibirConflito(celula, materiaAntiga, materiaNova) {
  const celulaConflito = celula;

  celulaConflito.style.background = "red";
  celulaConflito.style.color = "white";
  celulaConflito.style.fontWeight = "bold";
  celulaConflito.style.fontSize = "10px";

  // Adiciona a mensagem de conflito
  celula.innerHTML = `
        <div class="conflito-ativo">
            ⚠️ CONFLITO<br>
            ${materiaAntiga} + ${materiaNova}
        </div>
    `;
}

function atualizarGrade() {
  // 1. Primeiro, limpamos o visual do HTML
  limparGradeVisualmente();

  // 2. Zeramos o nosso controle lógico de ocupação
  celulasOcupadas = {};

  // 3. Redesenhamos apenas as matérias que estão no array de ativas
  materiasAtivas.forEach((materia) => {
    const slots = decodificaHorario(materia.horario);

    // Recuperamos a cor que já tínhamos definido para essa matéria
    // Se você ainda não tem o objeto coresAtribuidas, podemos gerar na hora:
    if (!coresAtribuidas[materia.nome]) {
      coresAtribuidas[materia.nome] = corMateriaAtual(indiceCor);
    }

    const cor = coresAtribuidas[materia.nome];

    // Chamamos a sua função de desenho original
    desenhaMateria(slots, materia.nome, cor);
  });
}

function limparGradeVisualmente() {
  // Seleciona todas as células que têm o ID começando com 'cell-'
  const celulas = document.querySelectorAll('[id^="cell-"]');

  celulas.forEach((celula) => {
    // 1. Remove estilos inline (background, cores, etc)
    celula.style.backgroundColor = "";
    celula.style.color = "";
    celula.style.fontWeight = "";
    celula.style.fontSize = "";

    // 2. Remove o conteúdo interno (o HTML do aviso de conflito)
    celula.innerHTML = "";

    // 3. REMOVE AS CLASSES (Isso é o mais importante!)
    celula.classList.remove("ocupada", "conflito-ativo");
  });
}

function carregarCursoEscolhido() {
  const selectedCurso = document.getElementById("curso-select");
  const listaContainer = document.querySelector(".lista-materias");
  listaContainer.innerHTML = "";
  if (!listaContainer) return; // Segurança caso o container não exista na página

  const cursoAtual = selectedCurso.value;

  resetarTudo();
  if (cursoAtual) {
    carregaListaMaterias(cursoAtual);
    console.log("Deu certo");
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

function resetarTudo() {
  // 1. Limpa a lista de matérias que o JS estava guardando
  materiasAtivas = [];

  // 2. Limpa o controle de ocupação (conflitos)
  celulasOcupadas = {};

  // 3. Limpa todas as cores e nomes da grade visual (HTML)
  limparGradeVisualmente();

  console.log("Grade e memória resetadas para o novo curso.");
}

function toggleMateria(event) {
  const checkbox = event.target;
  const cursoAtual = document.getElementById("curso-select").value;
  const idMateria = checkbox.dataset.id;
  const info = bancoDados[cursoAtual].find((m) => m.id == idMateria);

  if (checkbox.checked) {
    // Adiciona a matéria à lista de ativas se não estiver lá
    if (!materiasAtivas.find((m) => m.id == idMateria)) {
      materiasAtivas.push(info);
    }
  } else {
    // Remove a matéria da lista de ativas
    materiasAtivas = materiasAtivas.filter((m) => m.id != idMateria);
  }

  // O toque de mágica: redesenha tudo baseado na nova lista
  atualizarGrade();
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
