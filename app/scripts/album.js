var albumPicasso = {
  name: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: '../assets/images/album_covers/01.png',
  songs: [
    { name: 'Blue', length: '4:26' },
    { name: 'Green', length: '3:14' },
    { name: 'Red', length: '5:01' },
    { name: 'Pink', length: '3:21' },
    { name: 'Magenta', length: '2:15' }
  ]
};

var albumMarconi = {
   name: 'The Telephone',
   artist: 'Guglielmo Marconi',
   label: 'EM',
   year: '1909',
   albumArtUrl: '../assets/images/album_covers/20.png',
   songs: [
       { name: 'Hello, Operator?', length: '1:01' },
       { name: 'Ring, ring, ring', length: '5:01' },
       { name: 'Fits in your pocket', length: '3:21'},
       { name: 'Can you hear me now?', length: '3:14' },
       { name: 'Wrong phone number', length: '2:15'}
   ]
};

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
    
    if (currentlyPlayingSong === null) {
      $songNumTableCell.html(pauseButtonTemplate);
      currentlyPlayingSong = $songNumTableCell.attr('data-song-number');
    } else if (currentlyPlayingSong === $songNumTableCell.attr('data-song-number')) {
      $songNumTableCell.html(playButtonTemplate);
      currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== $songNumTableCell.attr('data-song-number')) {
      $songNumTableCell.html(pauseButtonTemplate);
      var $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSong + '"]')/*.attr('data-song-number')*/;
      $currentlyPlayingSongElement.html(currentlyPlayingSong);
      currentlyPlayingSong = $songNumTableCell.attr('data-song-number');
    }
  };
  
  var onHover = function() {
    var $getElem = $(this).find('.song-item-number');
    var $getElemData = $getElem.attr('data-song-number');
    
    if ($getElemData !== currentlyPlayingSong) {
      $getElem.html(playButtonTemplate);
    }
  };
  
  var offHover = function() {
    
    var $getElem = $(this).find('.song-item-number');
    var $getElemData = $getElem.attr('data-song-number');
    
    if($getElemData !== currentlyPlayingSong) {
      $getElem.html($getElemData);
    }
  };
  
  $row.click(clickHandler);
  $row.hover(onHover,offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  
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

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

$(document).ready(function() {

  setCurrentAlbum(albumPicasso);

}); 

