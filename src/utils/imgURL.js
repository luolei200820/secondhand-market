const imgURL = (filename) => {
    if (!filename) return ''
    return process.env.VUE_APP_imgURL + filename
}

export default imgURL