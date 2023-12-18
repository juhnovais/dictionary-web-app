document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const searchBtn = document.getElementById('button-addon2');
    const searchInput = document.getElementById('searchWord');
    const searchResult = document.getElementById('searchResult');
    const errorMsg = document.getElementById('emptyInput');
    const inputWrap = document.getElementById('searchInputWrap');
    const wrongWord = document.getElementById('wrongWord');
    const appContainer = document.getElementById('appContainer');

    // Function to fetch word information
    const getWord = function () {
        const searchWord = document.getElementById('searchWord').value.trim();

        if (searchWord) {
            $.ajax({
                url: "https://api.dictionaryapi.dev/api/v2/entries/en/" + searchWord,
                type: "GET",
                "timeout": 0,
                success: function (response) {
                    // Display search result
                    searchResult.style.display = 'block';

                    // Extract and display word information
                    const h1 = document.querySelector('h1');
                    const phonetic = document.getElementById('phonetic');
                    const audio = document.getElementById('audioPlayer');
                    const source = document.getElementById('source');
                    const result = response[0];

                    h1.textContent = result.word;
                    phonetic.textContent = result.phonetic;

                    const firstNonEmptyAudio = result.phonetics.find(phonetic => phonetic.audio !== '');

                    if (firstNonEmptyAudio) {
                        audio.src = firstNonEmptyAudio.audio;
                    }

                    const allMeaning = result.meanings;

                    // Loop through all meanings and create HTML structure
                    allMeaning.forEach(allMeaning => {


                        const wrapRowContainer = document.createElement('div');
                        wrapRowContainer.classList.add(allMeaning.partOfSpeech, 'row');

                        const colContainer = document.createElement('div');
                        colContainer.classList.add('col');

                        const rowHeader = document.createElement('div');
                        rowHeader.classList.add('row', 'd-flex', 'align-items-center', 'mt-4');

                        const colHeaderLeft = document.createElement('div');
                        colHeaderLeft.classList.add('col-3', 'col-md-2', 'col-lg-1');

                        const h2Title = document.createElement('h2');
                        h2Title.textContent = allMeaning.partOfSpeech;

                        colHeaderLeft.appendChild(h2Title);

                        const colHeaderRight = document.createElement('div');
                        colHeaderRight.classList.add('col-9', 'col-md-10', 'col-lg-11');

                        const hr = document.createElement('hr');
                        colHeaderRight.appendChild(hr);

                        rowHeader.appendChild(colHeaderLeft);
                        rowHeader.appendChild(colHeaderRight);

                        const rowMeaning = document.createElement('div');
                        rowMeaning.classList.add('row');

                        const colMeaning = document.createElement('div');
                        colMeaning.classList.add('col');

                        const h3Meaning = document.createElement('h3');
                        h3Meaning.classList.add('margin');
                        h3Meaning.textContent = 'Meaning';

                        const ulMeaning = document.createElement('ul');
                        ulMeaning.id = 'meaning';

                        const definitions = allMeaning.definitions;


                        colMeaning.appendChild(h3Meaning);
                        colMeaning.appendChild(ulMeaning);

                        // Loop through all the definitions
                        definitions.forEach(definitions => {
                            const newli = document.createElement('li');
                            const blockquoteTextResult = definitions.example;

                            newli.innerHTML = definitions.definition;
                            ulMeaning.appendChild(newli);

                            if (blockquoteTextResult) {
                                const blockquote = document.createElement('blockquote');
                                blockquote.classList.add('blockquote');
                                newli.appendChild(blockquote);

                                const blockquoteText = document.createElement('p');

                                blockquote.appendChild(blockquoteText);
                                blockquoteText.textContent = '"' + blockquoteTextResult + '"';

                            }


                        });




                        rowMeaning.appendChild(colMeaning);


                        if (allMeaning.synonyms.length > 0) {
                            const rowSynonyms = document.createElement('div');
                            rowSynonyms.classList.add('row', 'd-flex', 'align-items-start');

                            const colSynonymsLeft = document.createElement('div');
                            colSynonymsLeft.classList.add('col-3', 'col-md-2', 'col-lg-1');

                            const h3Synonyms = document.createElement('h3');
                            h3Synonyms.textContent = 'Synonyms';

                            colSynonymsLeft.appendChild(h3Synonyms);

                            const colSynonymsRight = document.createElement('div');
                            colSynonymsRight.classList.add('col-9', 'col-md-10', 'col-lg-11');

                            const pSynonyms = document.createElement('p');
                            pSynonyms.id = 'synonyms';
                            pSynonyms.classList.add('purple');

                            // Create a string by joining the synonyms with commas
                            const synonymsText = allMeaning.synonyms.join(', ');

                            // Set the text content of the <p> element
                            pSynonyms.textContent = synonymsText;

                            colSynonymsRight.appendChild(pSynonyms);

                            rowSynonyms.appendChild(colSynonymsLeft);
                            rowSynonyms.appendChild(colSynonymsRight);

                            colContainer.appendChild(rowHeader);
                            colContainer.appendChild(rowMeaning);

                            colContainer.appendChild(rowSynonyms);
                        } else {
                            colContainer.appendChild(rowHeader);
                            colContainer.appendChild(rowMeaning);
                        }

                        wrapRowContainer.appendChild(colContainer);

                        // Append the created structure to an existing HTML element with id "appContainer"

                        appContainer.appendChild(wrapRowContainer);
                    })

                    // Display source URL if available
                    if (result.sourceUrls[0]) {
                        source.href = result.sourceUrls[0];
                        source.textContent = result.sourceUrls[0];
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    // Display error message and reset page
                    wrongWord.style.display = 'flex';
                    reset();
                },
            });
        } else {
            reset();
        }
    }

    // Function to reset the page
    const reset = function () {
        searchResult.style.display = 'none';
        appContainer.innerHTML = '';
    }

    // Event listener for the 'input' event on the search input
    searchInput.addEventListener('input', function (event) {
        if (searchInput.value.trim() === '') {
            reset();
        }
    });

    // Event listener for the search button
    searchBtn.addEventListener('click', function () {
        if (searchInput.value.trim() === '') {
            errorMsg.style.display = 'block';
            inputWrap.style.border = '1px solid #FF5252';
        } else {
            // Hide error message, reset border, hide wrong word message, and fetch the word
            errorMsg.style.display = 'none';
            inputWrap.style.border = 'none';
            wrongWord.style.display = 'none';
            getWord();
        }
    });

    // Event listener for the 'keypress' event on the search input
    searchInput.addEventListener('keypress', function (event) {
        // Hide error messages and wrong word message
        errorMsg.style.display = 'none';
        inputWrap.style.border = 'none';
        wrongWord.style.display = 'none';

        if (event.key === 'Enter') {
            if (searchInput.value.trim() === '') {
                inputWrap.style.border = '1px solid #FF5252';
                errorMsg.style.display = 'block';
            } else {
                // Fetch the word when Enter is pressed
                getWord();
            }
        }
    });
});
