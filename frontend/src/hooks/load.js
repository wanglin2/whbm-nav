// 加载js资源
export const useLoadJsResource = () => {
    let elList = [];

    const load = async (jsList) => {
        let taskList = jsList.map((url) => {
            return new Promise((resolve, reject) => {
                let el = document.createElement("script");
                el.src = url;
                el.onload = () => {
                    resolve();
                };
                el.onerror = (e) => {
                    reject(e);
                };
                document.body.appendChild(el);
                elList.push(el);
            });
        });
        await Promise.all(taskList);
    };

    const unload = () => {
        elList.forEach((el) => {
            document.body.removeChild(el);
        });
    }

    return {
        load,
        unload
    };
};