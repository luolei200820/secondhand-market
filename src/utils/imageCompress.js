import imageCompression from "browser-image-compression";
const imageCompress = async (file) => {
    try {
        if (!file.type === "image/jpeg" || !file.type === "image/png") {
            this.$toast("请选择jpg、jpeg、png格式的图片");
            return Promise.reject();
        } else if (file.size < 200 * 1024) {
            // 文件小于200KB直接返回图片
            return file;
        } else {
            // 压缩图片
            const blob = await imageCompression(file, { maxSizeMB: 0.2 });
            return new File([blob], file.name, { type: "image/jpeg" });
        }
    } catch (err) {
        console.error(err);
        return Promise.reject();
    }
}

export default imageCompress