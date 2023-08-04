import fs from 'fs'

export const lyrics = "somebody once told me the world is gonna roll me i ain't the sharpest tool in the shed she was looking kind of dumb with her finger and her thumb in the shape of an l on her forehead well the years start coming and they don't stop coming fed to the rules and i hit the ground running didn't make sense not to live for fun your brain gets smart but your head gets dumb so much to do so much to see so what's wrong with taking the back streets you'll never know if you don't go you'll never shine if you don't glow hey now you're an all star get your game on go play hey now you're a rock star get the show on get paid and all that glitters is gold only shooting stars break the mold it's a cool place and they say it gets colder you're bundled up now wait til you get older but the meteor men beg to differ judging by the hole in the satellite picture the ice we skate is getting pretty thin the water's getting warm so you might as well swim my world's on fire how about yours that's the way i like it and i'll never get bored hey now you're an all star get your game on go play hey now you're a rock star get the show on get paid all that glitters is gold only shooting stars break the mold hey now you're an all star get your game on go play hey now you're a rock star get the show on get paid and all that glitters is gold only shooting stars somebody once asked could i spare some change for gas i need to get myself away from this place i said yup what a concept i could use a little fuel myself and we could all use a little change well the years start coming and they don't stop coming fed to the rules and i hit the ground running didn't make sense not to live for fun your brain gets smart but your head gets dumb so much to do so much to see so what's wrong with taking the back streets you'll never know if you don't go you'll never shine if you don't glow hey now you're an all star get your game on go play hey now you're a rock star get the show on get paid and all that glitters is gold only shooting stars break the mold and all that glitters is gold only shooting stars break the mold"

export const lyricsSplit = lyrics.toLowerCase().split(" ");
export const { counts: lyricsCounts, target: lyricsSplitWithIndices } = lyricsSplit.reduce((acc, curr) => { 
    const { target, counts } = acc;
    counts[curr] = typeof counts[curr] === "undefined" ? 0 :  counts[curr] + 1;
    target.push({word: curr, index: counts[curr]})
    return {
        target,
        counts,
    }
} , { target: [] as any[], counts: {}});

const loadDict = () => {
    try {
        const rawdata = fs.readFileSync('data.json');
        const data = JSON.parse(rawdata.toString());
        console.log("Loaded data")
        return data;
    } catch (err) {
        console.log("Could not load data")
        return lyricsSplit.reduce((acc, curr) => { return {...acc, [curr]: []}; }, {});
    }
}

export const lyricsDict = loadDict();
export const uniqueLyrics = Object.keys(lyricsDict);
export const lyricsRegex = new RegExp(`^(${uniqueLyrics.join("|")})(?:\\s+\\w*)*$`, 'i')


export const getFeed = () => lyricsSplitWithIndices.map(({word, index}) => ({post: lyricsDict[word]?.[index]?.uri}) )
export let generatedFeed = getFeed();

export const getFilteredFeed = () => generatedFeed.filter(({ post }) => !!post)
export let filteredFeed = getFilteredFeed();

export const generateFeeds = () => {
    generatedFeed = getFeed();
    filteredFeed = getFilteredFeed();
}

export const getFeedCompletion = () => {
    const complete = generatedFeed.filter(item => !!item.post )
    return (100.0*complete.length/generatedFeed.length).toFixed(2);
}

export const saveDict = () => {
    fs.writeFile('data.json', JSON.stringify(lyricsDict), (err) => {
        if (err) {
            console.log("Could not save data")
        } else {
            console.log("Saved data");
        }
    })
}

export const savePost = (word: string, data: any) => {
    lyricsDict[word] = [data, ...(lyricsDict[word] ?? []).slice(0, lyricsCounts[word])]
    generateFeeds();
    saveDict();
}

console.log(`${getFeedCompletion()}% complete`)
