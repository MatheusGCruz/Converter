# Antares Converter

A multi-purpose converter application built with React and TypeScript. Convert between units, formats, and validate data with a clean, dark-themed interface.

**Live demo:** [converter.antares.ninja](https://converter.antares.ninja/)

> More projects at [matheus.antares.ninja](https://matheus.antares.ninja/)

---

## Highlights

- **6 converter categories**: Distance, Temperature, Volume, Area, Time, and Text
- **Bidirectional conversion**: click the arrow to convert left-to-right or right-to-left
- **Multi-line support**: paste or type multiple values, one per line
- **Text prettifier**: auto-detect and format JSON, XML, HTML, CSS, JavaScript, YAML, and CSV
- **Regex validator**: validate text against Email, Brazilian Phone, Global Phone, CPF, CNPJ, and Website patterns with live pattern display
- **Dark space-themed UI** with smooth hover transitions

## How to Use

1. Select a category from the left dropdown (e.g., Distance, Time, Text)
2. Choose the source unit on the left and target unit on the right
3. Enter your value(s) in the left textarea
4. Click the arrow button to convert

### Text Category

- **Text Format - Auto**: pastes any text and the converter auto-detects the format, validates it, and pretty-prints the result on the right. Choose a specific format on the right to validate against that format instead.
- **Text - Regex**: type one or more lines on the left, pick **Text - Regex (auto)** on the right, and click the right arrow. Each line is checked against all saved regex patterns. Matches show a checkmark with the pattern name and regex; non-matches show an X.

### Time Category

Supports DateTime formats (`YY-MM-DD hh:mm`, `YY-MM-DD hh:mm:ss`, `YY-MM-DD hh:mm:ss.mls`), EPOCH timestamps, duration as `hh:mm:ss.mls`, and weeks as `WW DD hh:mm:ss.mls`.

## Getting Started

```bash
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

---

# Antares Converter (PT-BR)

Um conversor multiuso construído com React e TypeScript. Converta entre unidades, formate e valide dados com uma interface escura e limpa.

**Demonstração ao vivo:** [converter.antares.ninja](https://converter.antares.ninja/)

> Mais projetos em [matheus.antares.ninja](https://matheus.antares.ninja/)

---

## Destaques

- **6 categorias de conversão**: Distância, Temperatura, Volume, Área, Tempo e Texto
- **Conversão bidirecional**: clique na seta para converter da esquerda para a direita ou vice-versa
- **Suporte a múltiplas linhas**: cole ou digite vários valores, um por linha
- **Formatador de texto**: detecta automaticamente e formata JSON, XML, HTML, CSS, JavaScript, YAML e CSV
- **Validador Regex**: valide texto contra padrões de Email, Telefone Brasileiro, Telefone Global, CPF, CNPJ e Site com exibição do padrão
- **Interface escura com tema espacial** com transições suaves

## Como Usar

1. Selecione uma categoria no dropdown da esquerda (ex: Distância, Tempo, Texto)
2. Escolha a unidade de origem à esquerda e a unidade de destino à direita
3. Digite seu(s) valor(es) na área de texto da esquerda
4. Clique no botão de seta para converter

### Categoria Texto

- **Text Format - Auto**: cole qualquer texto e o conversor detecta automaticamente o formata, valida e exibe o resultado formatado à direita. Escolha um formato específico à direita para validar contra esse formato.
- **Text - Regex**: digite uma ou mais linhas à esquerda, selecione **Text - Regex (auto)** à direita e clique na seta direita. Cada linha é verificada contra todos os padrões regex salvos. Correspondências mostram um check com o nome do padrão e o regex; não correspondências mostram um X.

### Categoria Tempo

Suporta formatos DateTime (`YY-MM-DD hh:mm`, `YY-MM-DD hh:mm:ss`, `YY-MM-DD hh:mm:ss.mls`), timestamps EPOCH, duração como `hh:mm:ss.mls` e semanas como `WW DD hh:mm:ss.mls`.

## Primeiros Passos

```bash
npm install
npm start
```

Abra em [http://localhost:3000](http://localhost:3000).

---

# Antares Converter (ES)

Un conversor multipropósito construido con React y TypeScript. Convierte entre unidades, formatea y valida datos con una interfaz oscura y limpia.

**Demo en vivo:** [converter.antares.ninja](https://converter.antares.ninja/)

> Más proyectos en [matheus.antares.ninja](https://matheus.antares.ninja/)

---

## Highlights

- **6 categorías de conversión**: Distancia, Temperatura, Volumen, Área, Tiempo y Texto
- **Conversión bidireccional**: haz clic en la flecha para convertir de izquierda a derecha o viceversa
- **Soporte multi-línea**: pega o escribe varios valores, uno por línea
- **Formateador de texto**: detecta automáticamente y formatea JSON, XML, HTML, CSS, JavaScript, YAML y CSV
- **Validador Regex**: valida texto contra patrones de Email, Teléfono Brasileño, Teléfono Global, CPF, CNPJ y Sitio Web con visualización del patrón
- **Interfaz oscura con tema espacial** con transiciones suaves

## Cómo Usar

1. Selecciona una categoría del dropdown izquierdo (ej: Distancia, Tiempo, Texto)
2. Elige la unidad de origen a la izquierda y la unidad de destino a la derecha
3. Escribe tu(s) valor(es) en el área de texto de la izquierda
4. Haz clic en el botón de flecha para convertir

### Categoría Texto

- **Text Format - Auto**: pega cualquier texto y el conversor detecta automáticamente el formato, valida y muestra el resultado formateado a la derecha. Elige un formato específico a la derecha para validar contra ese formato.
- **Text - Regex**: escribe una o más líneas a la izquierda, selecciona **Text - Regex (auto)** a la derecha y haz clic en la flecha derecha. Cada línea se verifica contra todos los patrones regex guardados. Las coincidencias muestran un check con el nombre del patrón y el regex; las no coincidencias muestran una X.

### Categoría Tiempo

Soporta formatos DateTime (`YY-MM-DD hh:mm`, `YY-MM-DD hh:mm:ss`, `YY-MM-DD hh:mm:ss.mls`), timestamps EPOCH, duración como `hh:mm:ss.mls` y semanas como `WW DD hh:mm:ss.mls`.

## Primeros Pasos

```bash
npm install
npm start
```

Abre en [http://localhost:3000](http://localhost:3000).
