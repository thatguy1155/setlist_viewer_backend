export const artistQueries = {
    getArtist:"select * from artists where name = $1",
    addArtist:"insert into artists(external_id,name) VALUES ($1,$2) returning *"
};

export const setlistQueries = {
    getSetlist:"select * from setlists where date = $1",
    addSetlist:"insert into setlists(external_id,artist_id,updated_at,date) VALUES ($1,$2,$3,$4) returning *"
};

export const songQueries = {
    getSong:"select * from songs where name = $1 and artist_id = $2",
    addSong:"insert into songs(name,artist_id) VALUES ($1,$2) returning *",
    searchSong:"SELECT name, ts_rank_cd(to_tsvector(name), query) AS rank FROM songs, to_tsquery($1) query WHERE query @@ to_tsvector(name) AND artist_id = $2 ORDER BY rank DESC LIMIT 10"
};

export const setlistSongQueries = {
    getSetlistSong:"select date from setlist_songs inner join setlists on setlists.id = setlist_songs.setlist_id inner join songs on songs.id = setlist_songs.song_id where songs.name = $1 and songs.artist_id = $2",
    addSetlistSong:"insert into setlist_songs(setlist_id,song_id) VALUES ($1,$2) returning *"
};