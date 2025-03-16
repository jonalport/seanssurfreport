function loadYASContent(main) {
    main.innerHTML = `
        <section>
            <h2>Yas Kite Area, Abu Dhabi</h2>
            <p>Content for Yas Kite Area, Abu Dhabi.</p>
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