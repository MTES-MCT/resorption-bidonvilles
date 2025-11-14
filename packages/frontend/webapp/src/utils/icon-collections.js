const collections = [
    {
        prefix: "ri",
        icons: {
            "file-excel-fill": {
                body: '<path fill="currentColor" d="m16 2l5 5v14.008a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 21.008V2.992C3 2.444 3.445 2 3.993 2zm-2.8 10L16 8h-2.4L12 10.286L10.4 8H8l2.8 4L8 16h2.4l1.6-2.286L13.6 16H16z"/>',
            },
            "file-word-fill": {
                body: '<path fill="currentColor" d="m16 2l5 5v14.008a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 21.008V2.992C3 2.444 3.445 2 3.993 2zm-2 6v4.989L12 11l-1.99 2L10 8H8v8h2l2-2l2 2h2V8z"/>',
            },
            "flag-fill": {
                body: '<path fill="currentColor" d="M3 3h9.382a1 1 0 0 1 .894.553L14 5h6a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-6.382a1 1 0 0 1-.894-.553L12 16H5v6H3z"/>',
            },
            "sun-fill": {
                body: '<path fill="currentColor" d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12M11 1h2v3h-2zm0 19h2v3h-2zM3.515 4.929l1.414-1.414L7.05 5.636L5.636 7.05zM16.95 18.364l1.414-1.414l2.121 2.121l-1.414 1.414zm2.121-14.85l1.414 1.415l-2.121 2.121l-1.414-1.414zM5.636 16.95l1.414 1.414l-2.121 2.121l-1.414-1.414zM23 11v2h-3v-2zM4 11v2H1v-2z"/>',
            },
            "sun-line": {
                body: '<path fill="currentColor" d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12m0-2a4 4 0 1 0 0-8a4 4 0 0 0 0 8M11 1h2v3h-2zm0 19h2v3h-2zM3.515 4.929l1.414-1.414L7.05 5.636L5.636 7.05zM16.95 18.364l1.414-1.414l2.121 2.121l-1.414 1.414zm2.121-14.85l1.414 1.415l-2.121 2.121l-1.414-1.414zM5.636 16.95l1.414 1.414l-2.121 2.121l-1.414-1.414zM23 11v2h-3v-2zM4 11v2H1v-2z"/>',
            },
        },
        width: 24,
        height: 24,
    },
    {
        prefix: "mdi",
        icons: {
            "account-edit": {
                body: '<path fill="currentColor" d="m21.7 13.35l-1 1l-2.05-2.05l1-1a.55.55 0 0 1 .77 0l1.28 1.28c.21.21.21.56 0 .77M12 18.94l6.06-6.06l2.05 2.05L14.06 21H12zM12 14c-4.42 0-8 1.79-8 4v2h6v-1.89l4-4c-.66-.08-1.33-.11-2-.11m0-10a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4"/>',
            },
            "delete-outline": {
                body: '<path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/>',
            },
            "home-remove-outline": {
                body: '<path fill="currentColor" d="m14.46 15.88l1.42-1.42L18 16.59l2.12-2.12l1.42 1.41L19.41 18l2.13 2.12l-1.42 1.42L18 19.41l-2.12 2.13l-1.42-1.42L16.59 18l-2.12-2.12M5 20v-8H2l10-9l10 9h-5v-1.81l-5-4.5l-5 4.5V18h5c0 .7.12 1.37.34 2z"/>',
            },
            play: { body: '<path fill="currentColor" d="M8 5.14v14l11-7z"/>' },
        },
        width: 24,
        height: 24,
    },
    {
        prefix: "uil",
        icons: {
            "temperature-plus": {
                body: '<path fill="currentColor" d="M10.5 15.28V5.5a1 1 0 0 0-2 0v9.78a2 2 0 0 0-1 1.72a2 2 0 0 0 4 0a2 2 0 0 0-1-1.72m9-12.78H19V2a1 1 0 0 0-2 0v.5h-.5a1 1 0 0 0 0 2h.5V5a1 1 0 0 0 2 0v-.5h.5a1 1 0 0 0 0-2m-5.5 3a4.5 4.5 0 0 0-9 0V13a6 6 0 0 0 3.21 9.83a7 7 0 0 0 1.28.17A6 6 0 0 0 14 13Zm-2 14.61a4 4 0 0 1-6.42-2.2a4 4 0 0 1 1.1-3.76a1 1 0 0 0 .3-.71V5.5a2.5 2.5 0 0 1 5 0v7.94a1 1 0 0 0 .3.71a4 4 0 0 1-.28 6Z"/>',
            },
        },
        width: 24,
        height: 24,
    },
    {
        prefix: "bxs",
        icons: {
            "file-pdf": {
                body: '<path fill="currentColor" d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023c.479 0 .774-.242.774-.651c0-.366-.254-.586-.704-.586m3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018c.817.006 1.349-.444 1.349-1.396c.006-.83-.479-1.268-1.255-1.268"/><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9.498 16.19c-.309.29-.765.42-1.296.42a2 2 0 0 1-.308-.018v1.426H7v-3.936A7.6 7.6 0 0 1 8.219 14c.557 0 .953.106 1.22.319c.254.202.426.533.426.923c-.001.392-.131.723-.367.948m3.807 1.355c-.42.349-1.059.515-1.84.515c-.468 0-.799-.03-1.024-.06v-3.917A8 8 0 0 1 11.66 14c.757 0 1.249.136 1.633.426c.415.308.675.799.675 1.504c0 .763-.279 1.29-.663 1.615M17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17zM14 9h-1V4l5 5z"/>',
            },
        },
        width: 24,
        height: 24,
    },
    {
        prefix: "carbon",
        icons: {
            "temperature-hot": {
                body: '<path fill="currentColor" d="M26 13h4v2h-4zm-3-5.414l2.828-2.828l1.414 1.414L24.414 9zm0 12.828L24.414 19l2.828 2.828l-1.414 1.414zM17 2h2v4h-2zm1 6a6 6 0 0 0-1 .09v2.052A4 4 0 0 1 18 10a4 4 0 0 1 0 8v2a6 6 0 0 0 0-12m-8 12.184V7H8v13.184a3 3 0 1 0 2 0"/><path fill="currentColor" d="M9 30a6.993 6.993 0 0 1-5-11.89V7a5 5 0 0 1 10 0v11.11A6.993 6.993 0 0 1 9 30M9 4a3.003 3.003 0 0 0-3 3v11.983l-.332.299a5 5 0 1 0 6.664 0L12 18.983V7a3.003 3.003 0 0 0-3-3"/>',
            },
        },
        width: 32,
        height: 32,
    },
    {
        prefix: "fa-solid",
        icons: {
            spinner: {
                body: '<path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48m-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48m208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48M96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48s48-21.49 48-48m12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.491-48-48-48m294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.49-48-48-48M108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.491-48-48-48"/>',
            },
        },
        width: 512,
        height: 512,
    },
];
export const ri = {
    fileExcelFill: "ri:file-excel-fill",
    fileWordFill: "ri:file-word-fill",
    flagFill: "ri:flag-fill",
    sunFill: "ri:sun-fill",
    sunLine: "ri:sun-line",
};
export const mdi = {
    accountEdit: "mdi:account-edit",
    deleteOutline: "mdi:delete-outline",
    homeRemoveOutline: "mdi:home-remove-outline",
    play: "mdi:play",
};
export const uil = { temperaturePlus: "uil:temperature-plus" };
export const bxs = { filePdf: "bxs:file-pdf" };
export const carbon = { temperatureHot: "carbon:temperature-hot" };
export const faSolid = { spinner: "fa-solid:spinner" };
export default collections;
