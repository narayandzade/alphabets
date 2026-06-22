<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Alphabet Letter Trace</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="app">
  <header class="app-header">
    <div class="header-title">Alphabet Letter Trace</div>
    <div class="header-sub">Click any character to animate proper stroke order</div>
  </header>
  <div class="board-wrapper">
    <div class="board">
      <div class="line line-red  line-top"></div>
      <div class="line line-blue line-cap"></div>
      <div class="line line-blue line-base"></div>
      <div class="line line-red  line-desc"></div>
      <svg id="canvas" viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
    <div class="board-label" id="board-label">Click a character to begin</div>
  </div>
  <div class="panels-row">
    <div class="char-panel">
      <div class="panel-header">
        <span class="panel-label">A – Z</span>
        <span class="panel-tag">Capital</span>
      </div>
      <div class="char-grid" id="grid-upper"></div>
    </div>
    <div class="char-panel">
      <div class="panel-header">
        <span class="panel-label">a – z</span>
        <span class="panel-tag">Small</span>
      </div>
      <div class="char-grid" id="grid-lower"></div>
    </div>
    <div class="char-panel num-panel">
      <div class="panel-header">
        <span class="panel-label">0 – 100</span>
        <span class="panel-tag">Numbers</span>
      </div>
      <div class="char-grid num-grid" id="grid-nums"></div>
    </div>
  </div>
</div>
<script src="script.js"></script>
</body>
</html>