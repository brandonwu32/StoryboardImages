import "./Storyboard.css";
import { useState, useEffect } from "react";
import { getLyrics } from 'genius-lyrics-api';
import ReactLoading from 'react-loading';
const OpenAI = require("openai");


function Storyboard() {
    /* run this command in terminal
    open -na Google\ Chrome --args --user-data-dir=/tmp/temporary-chrome-profile-dir --disable-web-security
    */
    const[progressValue, setProgressValue] = useState(3);
    const[buttonColor, setButtonColor] = useState(1);
    const[lyrics, setLyrics] = useState([]);
    const[readableLyrics, setReadableLyrics] = useState([]);
    const[queryOne, setQueryOne] = useState(null);
    const[queryTwo, setQueryTwo] = useState(null);
    const[songName, setSongName] = useState(null);
    const[songLength, setSongLength] = useState(0);
    const[artistName, setArtistName] = useState(null);
    const[imageURL, setImageURL] = useState("https://miro.medium.com/v2/resize:fit:1400/1*LNdmjRS02HtkVdm9sc7IrA.jpeg");
    const[songLyrics, setSongLyrics] = useState(null);
    const[fiveParts, setFiveParts] = useState([]);
    const[paraphrasedParts, setParaphrasedParts] = useState([]);
    const[imageURLs, setImageURLs] = useState([]);
    const[loading, setLoading] = useState(false);
    const openai = new OpenAI({
        apiKey: `${process.env.REACT_APP_OPENAI_API_KEY}`,
        dangerouslyAllowBrowser: true,
    });
    /* pop songs generally follow ABABCB A = verse, B = chorus, C = Bridge
    Use OpenAI API to paraphrase ABABC to subject and predicate structure with noun generally, unless otherwise specified, being the artist.
    queries will be in a list of strings format
    iterate and inject into stable diffusion API to image URLs
    display 5 images in a column.
    */

    const handleParaphrase = async (e) => {
        setLoading(true);
        var urls = [];
        setProgressValue(2);
        for (let i = 0; i < songLength - 1; i++) {
            var songSection = fiveParts[i];
            try {
                const resultOne = await openai.completions.create({
                    model: "gpt-3.5-turbo-instruct",
                    prompt: `return a sentence NO MORE THAN 20 WORDS LONG, without brackets and without unnecessary new lines, containing a subject, being ${artistName} unless otherwise specified, and predicate that is descriptive enough to develop an image from using this section of a song: ${songSection}`,
                    max_tokens: 1000,
                    temperature: 0.4,
                  });

                const resultTwo = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: "visualize this lyric using appropriate colors and high resolution" + resultOne['choices'][0]['text'],
                    n: 1,
                    size: "1024x1024",
                  });
                urls.push(resultTwo.data[0].url);
            } catch (e) {
                console.log(e);
            }
        }
        setImageURLs(urls);
        setLoading(false);
    }

    useEffect(() => {
        console.log(paraphrasedParts);
    }, [paraphrasedParts])

    function setOptionValues(q1, q2) {
        setButtonColor("orange");
        const options = {
            apiKey: `${process.env.REACT_APP_GENIUS_DEV_KEY}`,
            title: q2,
            artist: q1,
            optimizeQuery: true,
            "Access-Control-Allow-Origin": "*",
        };
        getLyrics(options).then((lyrics) => setSongLyrics(lyrics));
        setArtistName(queryOne);
        setSongName(queryTwo);
    }

    useEffect(() => {
        if (songLyrics !== null) {
            console.log(songLyrics);
            extractFive(songLyrics);
        }
    }, [songLyrics])


    function extractFive(lyrics) {
        if (lyrics.includes("]")) {
            var splitLyrics = lyrics.split("]")
        } else {
            var splitLyrics = lyrics.split(")");
        }
        setLyrics(lyrics.split("\n"));
        var length = Math.min(6, splitLyrics.length);
        var start = 1;
        if (length < 5) {
            start = 0;
        }
        setSongLength(length);
        setFiveParts(splitLyrics.slice(start,length));
    }
    useEffect(() => {
        if (fiveParts.length !== 0)
            handleParaphrase();
    }, [fiveParts])

    useEffect(() => {
        if (imageURLs.length !== 0) {
            for (let i = 0; i < imageURLs.length; i++) {
                console.log(imageURLs[i]);
            }
            setButtonColor("rgb(0, 221, 0)");
            setProgressValue(3);
            setReadableLyrics(lyrics);
        }
        window.scrollTo(0, document.body.scrollHeight);
    }, [imageURLs])

    function progress() {
        if (progressValue === 2) {
            return (
                <ReactLoading type = "spin" color="#0000FF" height={100} width={50}></ReactLoading>
            );
        } else if (progressValue === 1) {
            return null;
        } else if (progressValue === 3) {
            return null;
        }
    }

    return (
        <div className = "storyboardBig">
            <div className = "storyboard">
                <h1 className = "storyboardTitle">Bring Your Music to Life</h1>
                <input className = "searchInput" id="searchInput" placeholder = "Artist Name" type = "text" onChange = {(e) => setQueryOne(e.target.value)}/>
                <input className = "searchInput" id="searchInput" placeholder = "Song Name" type = "text" onChange = {(e) => setQueryTwo(e.target.value)}/>
                <button className = "enterButton" onClick = {() => setOptionValues(queryOne, queryTwo)}><p className = "buttonText">Generate Image</p></button>
                <img className = "defaultImage" src = {new URL(imageURL)} alt = "hello"></img>
                <div className = "progress">
                    {progress()}
                </div>
            </div>
            <div className = "results">
                <div className = "lyrics">
                    {readableLyrics.map(line => (
                        <p className = "line">{line}</p>
                    ))}
                </div>
                <div className = "images">
                    {imageURLs.map(url => (
                        <img className = "generatedImage" src = {url} alt = "none"></img>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Storyboard;