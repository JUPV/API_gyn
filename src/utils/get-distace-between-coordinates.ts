export interface Coordinate {
  latitude: number
  longitude: number
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  // Verifica se as coordenadas de origem e destino são iguais
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  // Converte as latitudes de graus para radianos
  const fromRadian = (Math.PI * from.latitude) / 180
  const toRadian = (Math.PI * to.latitude) / 180

  // Calcula a diferença de longitude em graus e converte para radianos
  const theta = from.longitude - to.longitude
  const radTheta = (Math.PI * theta) / 180

  // Aplica a fórmula de cálculo da distância entre duas coordenadas
  let dist =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

  // Verifica se o valor calculado está acima de 1 (arco-cosseno aceita apenas valores entre -1 e 1)
  if (dist > 1) {
    dist = 1
  }

  // Aplica a fórmula final de cálculo da distância em quilômetros
  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344

  return dist
}
