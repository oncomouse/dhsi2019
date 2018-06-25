/* eslint-disable prefer-arrow-callback, no-var */
document.addEventListener('DOMContentLoaded', function onLoad() {
  var SAMPLE_LENGTH = 36;
  var STRING_LENGTH = 8;
  function randomString() {
    return Math.random()
      .toString(SAMPLE_LENGTH)
      .replace(/[^a-z]+/g, '')
      .substr(0, STRING_LENGTH - 1);
  }
  document.querySelector('#MyForm').addEventListener('submit', function onSubmit(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  });
  document.querySelectorAll('#MyForm button')[0].addEventListener('click', function onAppendClick(ev) {
    ev.preventDefault();
    document.querySelector('#MyForm ul').insertAdjacentHTML('beforeend', `<li>${randomString()}</li>`);
  });
  document.querySelectorAll('#MyForm button')[1].addEventListener('click', function onResetClick(ev) {
    var nodes = document.querySelectorAll('#MyForm ul li');
    ev.preventDefault();
    if (nodes.length > 0) {
      Array.from(nodes, function removeNode(el) {
        el.parentNode.removeChild(el);
        return el;
      });
    }
  });
});
