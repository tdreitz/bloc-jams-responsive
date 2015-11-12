var createSongRow = function(songNumber,songTitle,songDuration) {
  var template = 
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songTitle + '</td>'
  + '  <td class="song-item-duration">' + songDuration + '</td>'
  + '</tr>'
  ;

  var $row = $(template);
  
  var clickHandler = function() {
    var $songNumTableCell = $(this).find('.song-item-number');

    var updatePlayerBarSong = function() {
      var playerBarInfo = $('.player-bar h2');
      playerBarInfo.eq(0).html(currentAlbum.artist + ' – ' + currentSongFromAlbum.name);
      playerBarInfo.eq(1).html(currentSongFromAlbum.name);
      playerBarInfo.eq(2).html(currentAlbum.artist);

      $('.main-controls .play-pause').html(playerBarPauseButton);
    };
    
    if (currentlyPlayingSongNumber === null) {
      $songNumTableCell.html(pauseButtonTemplate);
      currentlyPlayingSongNumber = parseInt($songNumTableCell.attr('data-song-number'));
      currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
      updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === $songNumTableCell.attr('data-song-number')) {
      $songNumTableCell.html(playButtonTemplate);
      currentlyPlayingSongNumber = null;
      $('.main-controls .play-pause').html(playerBarPlayButton);
    } else if (currentlyPlayingSongNumber !== $songNumTableCell.attr('data-song-number')) {
      $songNumTableCell.html(pauseButtonTemplate);
      var $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
      $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
      currentlyPlayingSongNumber = parseInt($songNumTableCell.attr('data-song-number'));
      currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
      updatePlayerBarSong();
    };

    console.log(typeof(currentlyPlayingSongNumber));
  };
  
  var onHover = function() {
    var $getElem = $(this).find('.song-item-number');
    var $getElemData = parseInt($getElem.attr('data-song-number'));
    
    if ($getElemData !== currentlyPlayingSongNumber) {
      $getElem.html(playButtonTemplate);
    }
  };
  
  var offHover = function() {
    
    var $getElem = $(this).find('.song-item-number');
    var $getElemData = parseInt($getElem.attr('data-song-number'));
    
    if($getElemData !== currentlyPlayingSongNumber) {
      $getElem.html($getElemData);
    }

    console.log("songNumber type is " + typeof($getElemData) + "\n and currentlyPlayingSongNumber type is " + typeof(currentlyPlayingSongNumber));
  };
  
  $row.click(clickHandler);
  $row.hover(onHover,offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  
  currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.name);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    $albumSongList.append($newRow);
  }
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {

  var getLastSongNumber = function(index) {
    return index == 0 ? currentAlbum.songs.length : index;
  }

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  $('.currently-playing .song-name').text(currentSongFromAlbum.name);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentAlbum.artist + " - " + currentSongFromAlbum.name);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber +'"]');

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {

  var getLastSongNumber = function(index) {
    return index == (currentAlbum.songs.length -1) ? 1 : index + 2;
  }

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  currentlyPlayingSongNumber = currentSongIndex + 1;

  $('.currently-playing .song-name').text(currentSongFromAlbum.name);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentAlbum.artist + " - " + currentSongFromAlbum.name);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  
  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(currentlyPlayingSongNumber);
};

console.log(typeof(currentlyPlayingSongNumber));

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"><span>';
var playerBarPauseButton = '<span class="ion-pause"><span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {

  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);

}); 

