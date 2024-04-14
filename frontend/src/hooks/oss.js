export const useOss = (dir = 'whbm_new') => {
    return new window.OSS_APP({
        accessKeyId: '',
        accessKeySecret: '',
        type: '',
        region: '',
        bucket: '',
        dir,
        randomName: true
    });
}