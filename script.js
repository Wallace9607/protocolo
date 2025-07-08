document.getElementById("baixarPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4"); // retrato, milímetros, tamanho A4

  const elemento = document.getElementById("protocologeral");

  // >>> OCULTAR BORDAS E PLACEHOLDERS TEMPORARIAMENTE
  const inputs = elemento.querySelectorAll("input");
  inputs.forEach(input => {
    input.dataset.originalPlaceholder = input.placeholder; // salva o placeholder
    input.placeholder = ""; // oculta o placeholder
    input.style.border = "none"; // remove borda
    input.style.outline = "none"; // remove contorno de foco
  });

  // >>> REMOVER CHECKBOXES NÃO SELECIONADOS EM .documentos TEMPORARIAMENTE
const fieldsetDocumentos = elemento.querySelector("fieldset.documentos");
const labels = fieldsetDocumentos.querySelectorAll("label");

const labelsRemovidas = [];
labels.forEach(label => {
  const checkbox = label.querySelector("input[type='checkbox']");
  if (checkbox && !checkbox.checked) {
    labelsRemovidas.push(label); // salva para restaurar depois
    label.remove(); // remove do DOM
  }
});

  html2canvas(elemento, {
    scale: 2, // aumenta resolução do canvas
    useCORS: true
  }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");

    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let y = 10; // Margem superior

    if (imgHeight > pageHeight) {
      const scale = pageHeight / imgHeight;
      doc.addImage(
        imgData,
        "PNG",
        0,
        y,
        imgWidth * scale,
        imgHeight * scale
      );
    } else {
      doc.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
    }

    doc.save("protocolo_CPF.pdf");

    // >>> RESTAURAR BORDAS E PLACEHOLDERS
    inputs.forEach(input => {
      input.placeholder = input.dataset.originalPlaceholder || "";
      input.style.border = "";
      input.style.outline = "";
    });
    // >>> RESTAURAR CHECKBOXES REMOVIDOS
    labelsRemovidas.forEach(label => {
      fieldsetDocumentos.querySelector(".checkbox-group").appendChild(label);
    });
  });
});


const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const dataFormatada = `${dia}/${mes}/${ano}`;

    const timeTag = document.getElementById('dataAtual');
    timeTag.textContent = dataFormatada;
    timeTag.setAttribute('datetime', `${ano}-${mes}-${dia}`); // padrão ISO para máquina

    //CEP
    document.getElementById('cep').addEventListener('blur', function () {
  const cep = this.value.replace(/\D/g, '');

  if (cep.length !== 8) {
    alert('CEP inválido!');
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(dados => {
      if (dados.erro) {
        alert('CEP não encontrado!');
        return;
      }

      document.getElementById('logradouro').value = dados.logradouro || '';
      document.getElementById('bairro').value = dados.bairro || '';
      document.getElementById('municipio').value = dados.localidade || '';
      document.getElementById('uf').value = dados.uf || '';
    })
    .catch(error => {
      console.error('Erro ao buscar CEP:', error);
      alert('Erro ao buscar o endereço. Tente novamente.');
    });
});

//nome do atendente
document.getElementById("atendenteInput").addEventListener("input", function () {
    const nome = this.value;
    document.getElementById("nomeAtendenteExibido").textContent = nome;
});


const configuracoesProtocolo = {
  "maior-16": {
    documentos: [
      "Documento de identidade com foto do interessado",
      "Certidão de Casamento ou Certidão de Nascimento (Caso o documento de identidade não esteja atualizado)",
      "Documento que comprove a legitimidade do representante legal/procurador (se for o caso)",
      "Documento de identificação com foto da pessoa que comparece ao atendimento",
      "Título de eleitor (obrigatório entre 18 e 70 anos)",
      "Protocolo de atendimento fornecido pelo Banco do Brasil, Correios ou Caixa Econômica ou Protocolo de Atendimento gerado pela Internet, se possuir",
      "Comprovante ou informação do endereço"
    ]
  },
  "menor-16": {
    documentos: [
        "Documento de identidade ou Certidão de Nascimento do menor",
        "Documento de identificação com foto da pessoa que comparece ao atendimento (o próprio interessado, representante legal/procurador, se for o caso) que permita identificação e conferência de assinatura;",
        "Documento que comprove a legitimidade do responsável",
        "Comprovante de endereço do responsável"
    ]
  },
  "falecido": {
    documentos: [
        "Documento(s) que justifique(m) a necessidade de inscrição no CPF de pessoa falecida;",
        "Certidão de Óbito (ou Certidão de Nascimento ou Certidão de Casamento, aceitas em substituição à Certidão de Óbito apenas se nelas constarem a averbação da data do óbito);",
        "Documento de identificação oficial, Certidão de Nascimento ou Certidão de Casamento da pessoa falecida, caso não conste data de nascimento, naturalidade e filiação na Certidão de Óbito;",
        "Documento no qual conste o número do CPF do titular falecido (se possuir);",
        "Documento que comprove a legitimidade do representante legal (inventariante, cônjuge, companheiro(a), sucessor a qualquer título ou curador do falecido/ do pensionista por morte / procurador (se for o caso);",
        "Procuração pública ( no caso de representante legal do falecido ser analfabeto e estar sendo representado por procurador);",
        "Documento de identificação com foto da pessoa que comparece ao atendimento (o próprio interessado, representante legal /procurador, se for o caso) que permita identificação e conferência de assinatura;",
        "Comprovante ou informação do endereço",
    ]
  },
  "alteracao-sexo-nome": {
    documentos: [
        "Certidão de Nascimento nova em que conste o número do CPF;",
        "Certidão de Nascimento antiga e Certidão e Nascimento nova, se não houver menção ao CPF;",
        "Documento de identidade antigo e documento de identidade novo, se não houver menção ao CPF;",
        "Certidão de nascimento nova (sem o número do CPF), documento de identificação novo (sem o número do CPF) e cópia simples da decisão judicial ou certidão de objeto e pé, se for o caso;",
        "Certidão de Inteiro Teor;",
        "Procuração (se for o caso);",
        "Documento de identificação com foto da pessoa que comparece ao atendimento (o próprio interessado ou procurador, se for o caso) que permita identificação e conferência de assinatura;",
        "Título de eleitor (obrigatório entre 18 e 70 anos);",
        "Protocolo de atendimento fornecido pelo Banco do Brasil, Correios ou Caixa Econômica ou Protocolo de Atendimento gerado pela Internet, se possuir.",
        "Comprovante ou informação do endereço"
    ]
  },
  "estrangeiro-brasil": {
    documentos: [
        "Carteira do Registro Nacional Migratório (CRNM) ou a antiga Cédula de Identidade de Estrangeiro (CIE/RNE);",
        "Documento Provisório de Registro Nacional Migratório (DPRNM) emitido pela Polícia Federal para solicitantes de refúgio;",
        "Protocolo da CRNM, acompanhado do passaporte ou outro documento de identificação;",
        "Protocolo de Solicitação de Refúgio emitido pela Polícia Federal;",
        "Certificado de inscrição consular contendo a foto do estrangeiro;",
        "Documentos de viagem e de retorno dos Estados Partes do Mercosul e Estados associados, admitidos em acordo internacional:",
        "Documento que comprove a legitimidade do representante legal/procurador (se for o caso);",
        "Documento de identificação com foto da pessoa que comparece ao atendimento;",
        "Formulário “Declaração de Condição Fiscal” devidamente preenchido;",
        "Comprovante ou informação do endereço:"
    ]
  },
  "estrangeiro-exterior": {
    documentos: [
      " Passaporte;",
      " Documento de identificação do país de origem;",
      "Outros documentos de viagem e de retorno admitidos em tratados internacionais",
      "Carteira do Registro Nacional Migratório – CRNM expedida para residente fronteiriço;",
      "Documento que comprove a legitimidade do representante legal/procurador (se for o caso);",
      "Documento de identificação com foto da pessoa que comparece ao atendimento;",
      "Formulário “Declaração de Condição Fiscal” devidamente preenchido;",
      " Comprovante ou informação do endereço:",
    ]
  },
  "maior-16-nao-assina": {
    documentos: [
      "Documento de identidade com foto do interessado",
      "Certidão de Casamento ou Certidão de Nascimento (Caso o documento de identidade não esteja atualizado)",
      "Documento que comprove a legitimidade do representante legal/procurador (se for o caso)",
      "Documento de identificação com foto da pessoa que comparece ao atendimento",
      "Procuração pública ( no caso de analfabeto representado por procurador);",
      "Título de eleitor (obrigatório entre 18 e 70 anos)",
      "Protocolo de atendimento fornecido pelo Banco do Brasil, Correios ou Caixa Econômica ou Protocolo de Atendimento gerado pela Internet, se possuir",
      "Comprovante ou informação do endereço"
    ]
  }
};


function atualizarDocumentosObrigatorios(tipo) {
  const divGrupo = document.querySelector(".documentos .checkbox-group");
  divGrupo.innerHTML = ""; // Limpa os checkboxes

  const docs = configuracoesProtocolo[tipo]?.documentos || [];

  if (docs.length === 0) {
    divGrupo.innerHTML = "<p><em>Selecione um tipo de protocolo para ver a documentação obrigatória.</em></p>";
    return;
  }

  docs.forEach(doc => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    label.appendChild(input);
    label.append(" " + doc);
    divGrupo.appendChild(label);
  });
}

document.getElementById("tipoCpf").addEventListener("change", function () {
  const tipoSelecionado = this.value;
  atualizarDocumentosObrigatorios(tipoSelecionado);
});


  const inputInscricao = document.getElementById("inscricao");
  const inputAlteracao = document.getElementById("alteracao");
  const campoCpfContribuinte = document.getElementById("campo-cpf-contribuinte");

  inputInscricao.addEventListener("change", () => {
    if (inputInscricao.checked) {
      campoCpfContribuinte.style.display = "none";
    }
  });

  inputAlteracao.addEventListener("change", () => {
    if (inputAlteracao.checked) {
      campoCpfContribuinte.style.display = "block";
    }
  });

  const spanNome = document.getElementById("protocolo-nome");
  const spanResponsavel = document.getElementById("protocolo-nome-responsavel");
  const assinaturaNome = document.getElementById("assinatura-nome");

  function atualizarNomeAssinatura() {
    const nomeResponsavel = spanResponsavel.value.trim();
    const nomeContribuinte = spanNome.value.trim();

    if (nomeResponsavel.length > 0) {
      assinaturaNome.textContent = nomeResponsavel;
    } else if (nomeContribuinte.length > 0) {
      assinaturaNome.textContent = nomeContribuinte;
    } else {
      assinaturaNome.textContent = "Contribuinte ou responsável";
    }
  }

  // Atualiza ao digitar
  spanNome.addEventListener("input", atualizarNomeAssinatura);
  spanResponsavel.addEventListener("input", atualizarNomeAssinatura);


  function ajustarLarguraSpan(span) {
  const conteudo = span.textContent || span.innerText;
  const espelho = document.createElement('span');

  // Copia estilos relevantes
  espelho.style.position = 'absolute';
  espelho.style.visibility = 'hidden';
  espelho.style.whiteSpace = 'nowrap';
  espelho.style.font = window.getComputedStyle(span).font;
  espelho.textContent = conteudo || "\u200B"; // evita largura zero

  document.body.appendChild(espelho);
  span.style.width = espelho.offsetWidth + 2 + 'px';
  document.body.removeChild(espelho);
}

// Aplica ao carregar e ao editar
document.querySelectorAll('span[contenteditable="true"]').forEach(span => {
  // ... já faz ajuste de largura

  span.addEventListener('paste', e => {
    e.preventDefault();
    const texto = (e.clipboardData || window.clipboardData).getData('text').replace(/\n/g, ' ');
    document.execCommand('insertText', false, texto);
  });
});

