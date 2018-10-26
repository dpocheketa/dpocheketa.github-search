import { from, fromEvent } from 'rxjs';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';

let input = document.getElementById('search_input');
let searchSequence$ = fromEvent(input, 'keyup');

let request$ = function(searchValue){
    return from(
        fetch(`https://api.github.com/search/repositories?q=${searchValue}`)
            .then(res => res.json())
    );
};

let renderResult = (response) => {
    let resultContainer = document.getElementById('search_results');
    let resultContent = document.createElement('div');

    let createRepoItem = (repoItem) => {
      let item = document.createElement('div');

      item.innerHTML = `<a href="${repoItem.html_url}" target="_blank">${repoItem.name}</a>`;

      return item;
    };

    response.items.forEach((item) => {
        let repoItem = createRepoItem(item);
        resultContent.appendChild(repoItem)
    });
    window.console.log(response);

    resultContainer.removeChild(resultContainer.firstChild);
    resultContainer.appendChild(resultContent);
};

searchSequence$.pipe(
    map(ev => (ev.target as HTMLInputElement).value),
    filter(value => !!value),
    tap(val => console.log(val)),
    debounceTime(1000),
    tap(val => console.log('afterDebounce: ', val)),
    switchMap(value => request$(value))
).subscribe((response) => {
   renderResult(response);
});

