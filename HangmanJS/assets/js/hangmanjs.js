function get_definition(word){
    var request = 'http://api.wordnik.com:80/v4/word.json/' + word + '/definitions?limit=200&includeRelated=true&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
    return $.get(request);
}

$(function(){

    $(document).keypress(function(e) {
        if(e.which == 13) {
            e.preventDefault();
        }
    });


    var word;
    var def;
    var single_player = true;
    ready = false;
    $('#secret').hide()
    $('#userAns').hide()
    $('#gamePage').hide()
    $('#start').hide()
    $('#error').hide()

    $('#errorClose').on('click', function(){
        $('#error').fadeToggle()
    })

    $('#play').on('click', function(){
        $('#header-wrapper').hide()
        $('#splash').hide()
        $('#start').fadeToggle()
    })


// GET RANDOM WORD API CALL
    function getWord(type, c) {
        return $.ajax({
            url: 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=10&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
            success: function(data){
                data.definition = get_definition(data.word)
            }
        })
    }

    function random(){
        new_word_obj = getWord();
        return new_word_obj

    }

   randomWord =  random()



   function checkForSpacesInWord(string){
        return string.indexOf(' ') >= 0;
    }           

    function show_error(string){
        $('#error').fadeToggle()
        $('#errorText').text(string)
    }


    function startTwoPlayer(){
        word = $('#userWord').val().toUpperCase()
        if (checkForSpacesInWord(word)){
            show_error("You can't use spaces")
        } else if (!/^[a-zA-Z]*$/g.test(word)){
            show_error('Please Enter only letters')
        } else if (word.length < 1){
            show_error("You didn't type anythin in!") 
        } else {
            $('#secret').text(word)
            $('#start').hide()
            $('#gamePage').fadeToggle()
            for (i=0;i<word.length; i++){
                space = '__  '
                $('#showSpaces').text($('#showSpaces').text() + space);
            }
        }
    }

    $('#input').on('click', function(){
        startTwoPlayer()
    });

    $('#userWord').keypress(function(e){
        if (e.which == 13){
            startTwoPlayer()
        }
    })

    $('#getRandom').on('click', function(){
        single_player = false
        word = randomWord['responseJSON'].word.toUpperCase()
        if (checkForSpacesInWord(word) || (!/^[a-zA-Z]*$/g.test(word))){
            show_error('Our fault. We chose an invalid word. Please click that button again.')
            randomWord = random()
            return
        } else {
            $('#secret').text(word)
            $('#start').hide()
            $('#gamePage').fadeToggle()
            for (i=0;i<word.length; i++){
                space = '__  '
                $('#showSpaces').text($('#showSpaces').text() + space);
            }
        }
    })
// GAME LOGIC
   function gameLogic(){
    if ($('#letter').val().length > 1) {
            show_error('Please enter one letter at a time')
            return
    } else if ((!/^[a-zA-Z]*$/g.test($('#letter').val())) || ($('#letter').val() == '')) {
            show_error("You didn't type a letter in!")
            return
    } else {
        answer = $('#secret').text()
        guess = $('#letter').val().toUpperCase()
        $('#letter').val('')
        ans_array = []
        for (i=0; i<answer.length; i++){
            ans_array.push(answer[i])
        }
        if (guess_array.length == 0){
            for (i=0;i<ans_array.length;i++){
                guess_array.push('__  ')
            }
        }
        count_before = get_count()
        for (i=0; i<ans_array.length; i++){
            if (ans_array[i] == guess){
                guess_array[i] = guess
            } else {
                if (guess_array[i] == null){ 
                    guess_array[i] = '__  ';
                    firstPressCheck = 1
                } 
            }
        }
    }
    for (i=0; i<$('#lettersGuessed').text().length;i++){
        if (guess == $('#lettersGuessed').text()[i]){
            show_error("You already tried that one")
            return
        }
    }
    $('#lettersGuessed').text($('#lettersGuessed').text() + ' ' + guess)
    count_after = get_count()
    if (count_before == count_after){
        lives_array.push('X  ')
    }
    if (lives_array.length == 7){
        $('#errorHead').text('Sad day!')
        if (single_player == false){
            show_error('The word was' + ' ' + $('#secret').text() + ' ' + randomWord['responseJSON'].definition['responseJSON'][0].text)
        } else {
            show_error('The word was' + ' ' + $('#secret').text())
        }
        $('#errorClose').on('click', function(){
            location.reload()
        })
    }
    lives_taken = ''
    for (i=0; i<lives_array.length; i++){
        lives_taken += lives_array[i]
    }
    $('#lives').text(lives_taken)
    word = ''
    for (i=0; i<guess_array.length; i++){
        word += guess_array[i]
        $('#showSpaces').text(word)
        if (word == $('#secret').text()){
            $('#errorHead').text('Awwww Yeah!')
            if (single_player == false){
                show_error('You got it!' + ' ' +'The Word was ' + $('#secret').text() + ' ' + randomWord['responseJSON'].definition['responseJSON'][0].text)
            } else {
            show_error('The word was' + ' ' + $('#secret').text())
            }
            $('#errorClose').on('click', function(){
                location.reload()
            })
        }
    }
   }
// END GAME LOGIC

    $('#startOver').on('click', function(){
        location.reload()
    })

    function get_count(){
        count = 0
        for (i=0; i<guess_array.length; i++){
            if (guess_array[i] == '__  '){
                count += 1;
            }
        }
        return count
    }

    guess_array = []
    lives_array = []
    $('#try').on('click', function(){
        gameLogic()
    });

    $('#letter').keypress(function(e){
        if (e.which == 13){
            gameLogic()
        }
    })
});