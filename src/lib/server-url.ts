// Origine que Payload expose au client (serverURL) et qu'il préfixe aux URLs de
// médias. Le repli sur le domaine de prod n'est valable qu'en build de prod :
// en développement il enverrait les requêtes du panel admin vers clarabaptista.com,
// où le cookie de session local n'est pas envoyé — l'admin se croit déconnecté.
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://clarabaptista.com')
