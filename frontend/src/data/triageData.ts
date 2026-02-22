
export interface TriageOption {
  text: string;
  nextQuestionId?: string;
  resultServiceId?: string;
  resultAnalysis?: string;
}

export interface TriageQuestion {
  id: string;
  text: string;
  options: TriageOption[];
}

export const triageTree: Record<string, TriageQuestion> = {
  start: {
    id: 'start',
    text: '¿Cuál es el síntoma principal que notas en tu vehículo?',
    options: [
      { text: 'Ruidos extraños', nextQuestionId: 'ruidos' },
      { text: 'Pérdida de potencia o tirones', nextQuestionId: 'potencia' },
      { text: 'Humo o fugas de líquidos', nextQuestionId: 'fugas' },
      { text: 'Problemas al frenar o dirección', nextQuestionId: 'frenos_direccion' },
      { text: 'Luces encendidas en el tablero', nextQuestionId: 'tablero' },
      { text: 'No arranca / Falla eléctrica', nextQuestionId: 'electrico' }
    ]
  },
  ruidos: {
    id: 'ruidos',
    text: '¿Cuándo escuchas el ruido principalmente?',
    options: [
      { text: 'Al frenar (chirrido o roce metálico)', resultServiceId: 'frenos', resultAnalysis: 'Probable desgaste de pastillas o discos de freno. Es vital revisarlo por seguridad.' },
      { text: 'Al girar el volante', nextQuestionId: 'ruidos_giro' },
      { text: 'Al pasar por baches (golpeteo)', resultServiceId: 'suspension', resultAnalysis: 'Indica desgaste en amortiguadores, bujes o terminales de dirección.' },
      { text: 'Proveniente del motor al estar detenido', resultServiceId: 'motor', resultAnalysis: 'Puede ser una correa suelta o problema interno del motor. Requiere diagnóstico mecánico.' }
    ]
  },
  ruidos_giro: {
    id: 'ruidos_giro',
    text: '¿Es un "clac-clac" rítmico solo al doblar?',
    options: [
      { text: 'Sí, suena rítmico', resultServiceId: 'transmision', resultAnalysis: 'Probable falla en la junta homocinética (semieje).' },
      { text: 'No, es un zumbido constante', resultServiceId: 'suspension', resultAnalysis: 'Indica un rodamiento de masa (rodamiento de rueda) defectuoso.' }
    ]
  },
  potencia: {
    id: 'potencia',
    text: '¿El auto tironea o se siente "pesado"?',
    options: [
      { text: 'Tironea al acelerar', resultServiceId: 'afinamiento', resultAnalysis: 'Podría ser un problema de bujías, cables o inyectores sucios. Se recomienda afinamiento.' },
      { text: 'Sube la temperatura pero no avanza', resultServiceId: 'transmision', resultAnalysis: 'Falla probable en el embrague (autos manuales) o caja de cambios (automáticos).' },
      { text: 'Siente olor a combustible', resultServiceId: 'revision_general', resultAnalysis: 'Posible fuga de combustible o falla en la mezcla. Peligro de incendio, revisar pronto.' }
    ]
  },
  fugas: {
    id: 'fugas',
    text: '¿De qué color es el líquido que gotea?',
    options: [
      { text: 'Aceite oscuro/café', resultServiceId: 'aceite', resultAnalysis: 'Fuga de aceite de motor. Requiere cambio de empaquetaduras o sellos.' },
      { text: 'Verde/Rojo brillante y acuoso', resultServiceId: 'refrigeracion', resultAnalysis: 'Fuga de líquido refrigerante. Peligro de sobrecalentamiento del motor.' },
      { text: 'Agua clara (sin olor)', resultServiceId: 'revision_general', resultAnalysis: 'Probablemente condensación del aire acondicionado, suele ser normal.' }
    ]
  },
  frenos_direccion: {
    id: 'frenos_direccion',
    text: '¿Qué sientes al volante?',
    options: [
      { text: 'El pedal de freno está "esponjoso"', resultServiceId: 'frenos', resultAnalysis: 'Presencia de aire en el sistema hidráulico o bajo nivel de líquido. Riesgo alto.' },
      { text: 'El volante vibra a alta velocidad', resultServiceId: 'balanceo', resultAnalysis: 'Tus ruedas necesitan alineación y balanceo.' },
      { text: 'El volante está muy duro', resultServiceId: 'direccion', resultAnalysis: 'Falla en la bomba de dirección asistida o falta de líquido hidráulico.' }
    ]
  },
  tablero: {
    id: 'tablero',
    text: '¿De qué color es la luz que se encendió?',
    options: [
      { text: 'Roja (Aceite, Temperatura, Batería)', resultServiceId: 'grua', resultAnalysis: '¡Alerta! Detén el vehículo. El color rojo indica falla crítica. Se sugiere grúa a taller.' },
      { text: 'Amarilla / Naranja (Check Engine)', resultServiceId: 'escaner', resultAnalysis: 'El computador detectó una anomalía. Se requiere escáner automotriz para leer el código de falla.' }
    ]
  },
  electrico: {
    id: 'electrico',
    text: '¿Qué sucede al girar la llave?',
    options: [
      { text: 'No hace ningún ruido ni prenden luces', resultServiceId: 'bateria', resultAnalysis: 'Batería descargada o bornes sueltos/sulfatados.' },
      { text: 'Las luces prenden pero hace un chasquido', resultServiceId: 'electrico', resultAnalysis: 'Falla en el motor de partida.' },
      { text: 'El motor gira pero no arranca', resultServiceId: 'revision_general', resultAnalysis: 'Falla de encendido (bujías) o falta de combustible (bomba).' }
    ]
  }
};
