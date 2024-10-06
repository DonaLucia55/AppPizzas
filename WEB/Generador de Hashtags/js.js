async function generateHashtags() {
    const keyword = document.getElementById('keyword').value;
    const response = await fetch(`https://api.ritekit.com/v1/stats/hashtag-suggestions?text=${keyword}&client_id=32a1ff930fe54aef21a487c999aa6f10edb158221fb7`);
    const data = await response.json();
    const hashtags = data.hashtags.map(tag => `#${tag.tag}`).join(' ');
    document.getElementById('hashtags').innerText = hashtags;
}
