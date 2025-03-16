function loadDOSCContent(main) {
    main.innerHTML = `
        <section>
            <h2>Dubai Offshore Sailing Club</h2>
            <p>Content for Dubai Offshore Sailing Club.</p>
        </section>
    `;
    main.querySelector('section').style.cssText = `
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
        margin: 0;
    `;
}