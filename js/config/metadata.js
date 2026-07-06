const CERTIFICATE_FORM_METADATA = {
  fields: {
    protocoloMobi: {
      label: "Protocolo MOBI",
      validators: [
        { name: "required", message: "Informe o protocolo MOBI." },
        { name: "digitsBetween", min: 4, max: 6, message: "Informe um protocolo MOBI com 4 a 6 dígitos." }
      ]
    },

    tipoCertidao: {
      label: "Tipo de certidão",
      validators: [
        { name: "required", message: "Selecione o tipo de certidão." }
      ]
    },

    comboTipoPessoa: {
      label: "Tipo da parte",
      validators: [
        { name: "required", message: "Selecione pessoa física ou jurídica." }
      ]
    },

    comboCpf: {
      label: "CPF",
      validators: [
        { name: "required", message: "Informe o CPF." },
        { name: "cpf", message: "Informe um CPF válido." }
      ]
    },

    comboCnpj: {
      label: "CNPJ",
      validators: [
        { name: "required", message: "Informe o CNPJ." },
        { name: "cnpj", message: "Informe um CNPJ válido." }
      ]
    },

    comboRazaoSocial: {
      label: "Nome (Razão Social)",
      validators: [
        { name: "required", message: "Informe o nome ou razão social." }
      ]
    },

    comboNascimento: {
      label: "Data de nascimento",
      validators: [
        { name: "notFutureDate", message: "A data de nascimento não pode ser futura." }
      ]
    },

    iptuIndicacaoFiscal: {
      label: "Indicação fiscal",
      validators: [
        { name: "required", message: "Informe a indicação fiscal." },
        { name: "digitsBetween", min: 8, max: 12, message: "Informe a indicação fiscal com 8 a 12 dígitos." }
      ]
    },

    iptuTipoPessoa: {
      label: "Tipo de proprietário",
      validators: [
        { name: "required", message: "Selecione pessoa física ou jurídica." }
      ]
    },

    iptuCpf: {
      label: "CPF",
      validators: [
        { name: "required", message: "Informe o CPF." },
        { name: "cpf", message: "Informe um CPF válido." }
      ]
    },

    iptuCnpj: {
      label: "CNPJ",
      validators: [
        { name: "required", message: "Informe o CNPJ." },
        { name: "cnpj", message: "Informe um CNPJ válido." }
      ]
    },

    civilEstado: {
      label: "Estado",
      validators: [
        { name: "required", message: "Selecione o estado." }
      ]
    },

    civilCidade: {
      label: "Cidade",
      validators: [
        { name: "required", message: "Informe a cidade." }
      ]
    },

    civilCartorio: {
      label: "Cartório",
      validators: [
        { name: "required", message: "Informe o cartório." }
      ]
    },

    civilTipo: {
      label: "Tipo da certidão civil",
      validators: [
        { name: "required", message: "Selecione a certidão civil." }
      ]
    },

    civilNascimentoNome: {
      label: "Nome completo",
      validators: [
        { name: "required", message: "Preencha o nome obrigatório da certidão civil." }
      ]
    },

    civilNascimentoData: {
      label: "Data de nascimento",
      validators: [
        { name: "required", message: "Preencha a data de nascimento." },
        { name: "completeDate", message: "Preencha a data de nascimento completa." },
        { name: "notFutureDate", message: "A data de nascimento não pode ser futura." }
      ]
    },

    civilConjuge1: {
      label: "Cônjuge 1",
      validators: [
        { name: "required", message: "Informe o nome do cônjuge 1." }
      ]
    },

    civilConjuge2: {
      label: "Cônjuge 2",
      validators: [
        { name: "required", message: "Informe o nome do cônjuge 2." }
      ]
    },

    civilCasamentoData: {
      label: "Data de casamento",
      validators: [
        { name: "required", message: "Preencha a data de casamento." },
        { name: "completeDate", message: "Preencha a data de casamento completa." },
        { name: "notFutureDate", message: "A data de casamento não pode ser futura." }
      ]
    },

    civilObitoNome: {
      label: "Nome completo",
      validators: [
        { name: "required", message: "Preencha o nome obrigatório da certidão civil." }
      ]
    },

    civilObitoData: {
      label: "Data de óbito",
      validators: [
        { name: "required", message: "Preencha a data de óbito." },
        { name: "completeDate", message: "Preencha a data de óbito completa." },
        { name: "notFutureDate", message: "A data de óbito não pode ser futura." }
      ]
    },

    civilLivro: {
      label: "Livro",
      validators: [
        { name: "digitsOnly", message: "Livro deve conter apenas números." }
      ]
    },

    civilFolha: {
      label: "Folha",
      validators: [
        { name: "digitsOnly", message: "Folha deve conter apenas números." }
      ]
    },

    civilTermo: {
      label: "Termo",
      validators: [
        { name: "digitsOnly", message: "Termo deve conter apenas números." }
      ]
    },

    imovelEstado: {
      label: "Estado",
      validators: [
        { name: "required", message: "Selecione o estado." }
      ]
    },

    imovelCidade: {
      label: "Cidade",
      validators: [
        { name: "required", message: "Informe a cidade." }
      ]
    },

    imovelCartorio: {
      label: "Cartório",
      validators: [
        { name: "required", message: "Informe o cartório." }
      ]
    }
  }
};
