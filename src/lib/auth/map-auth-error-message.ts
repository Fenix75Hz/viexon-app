function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "";
}

export function getFriendlyAuthErrorMessage(error: unknown) {
  const message = getErrorMessage(error);

  switch (message) {
    case "Invalid login credentials":
      return "E-mail ou senha invalidos. Revise os dados e tente novamente.";
    case "Email not confirmed":
      return "Confirme seu e-mail antes de entrar na plataforma.";
    case "User already registered":
      return "Este e-mail ja possui uma conta ativa. Entre ou recupere seu acesso.";
    case "FULL_NAME_REQUIRED":
      return "Informe seu nome completo para continuar.";
    case "STORE_NAME_REQUIRED":
      return "Informe o nome da loja para concluir o cadastro.";
    case "RESELLER_REQUIRED":
      return "Selecione uma revendedora valida antes de finalizar.";
    case "RESELLER_NOT_FOUND_OR_UNAVAILABLE":
      return "A revendedora selecionada nao esta disponivel no momento.";
    case "PROFILE_ROLE_ALREADY_DEFINED":
      return "Este acesso ja possui um perfil definido. Entre para continuar.";
    case "PROFILE_ALREADY_REGISTERED_AS_CUSTOMER":
      return "Este usuario ja esta vinculado como cliente.";
    case "PROFILE_ALREADY_REGISTERED_AS_RESELLER":
      return "Este usuario ja esta vinculado como revendedora.";
    case "CUSTOMER_ALREADY_LINKED_TO_ANOTHER_RESELLER":
      return "Este cliente ja esta vinculado a outra revendedora.";
    case "AUTHENTICATION_REQUIRED":
      return "Sua sessao expirou. Entre novamente para continuar.";
    case "PROFILE_NOT_FOUND":
      return "Seu perfil ainda nao foi provisionado no banco. Tente novamente em instantes.";
    case "ONBOARDING_METADATA_MISSING":
      return "Os dados do seu perfil nao foram encontrados no cadastro. Saia e refaca a conta.";
    default:
      return message || "Nao foi possivel concluir a operacao agora. Tente novamente.";
  }
}
