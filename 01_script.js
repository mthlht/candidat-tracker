d3.json("data_base.json").then(data => {

    // Tri des données

    /// Données brutes
    const rawData = data["data"];

    /// Ordre groupes politiques
    const ordreCouleurs = {
        'Extrême gauche':0,
        'Ecologie':1,
        'Gauche':2,
        'Droite':3,
        'Extrême droite':4,
        'Inconnu':5
    };

    /// Données triées

    //// Liste des candidats
    const tidyData = rawData.reduce((acc, val) => {

        // Ajout valeur ordre des groupes politiques
        let couleur = val['tendance'];
        val['index_tendance'] = ordreCouleurs[couleur];

        // Répartition des données en groupes IN / OUT
        let groupe = val['situation'];

        if(acc[groupe] == null) {

            acc[groupe] = [val];

        } else {

            acc[groupe].push(val);

        };

        // Tri dans les groupes par tendance à partir d'index_tendance
        acc[groupe].sort((a, b) => {
            return a.index_tendance - b.index_tendance;
        })


        return acc

    }, {});

    //// Nombre de candidats par groupe (en chourse / hors course) et par tendance

    const dataLegendInObject = tidyData["en_course"].reduce((acc, val) => {

        // Répartition des données en groupes IN / OUT
        let tendance = val['tendance'];

        if(acc[tendance] == null) {

            acc[tendance] = 1;

        } else {

            acc[tendance] += 1;

        };

        return acc

    }, {});

    const dataLegendInArray = Object.entries(dataLegendInObject).map((d, i) => {

        return {name:d[0], nb:d[1]};

    });

    const dataLegendOutObject = tidyData["hors_course"].reduce((acc, val) => {

        // Répartition des données en groupes IN / OUT
        let tendance = val['tendance'];

        if(acc[tendance] == null) {

            acc[tendance] = 1;

        } else {

            acc[tendance] += 1;

        };

        return acc

    }, {});

    const dataLegendOutArray = Object.entries(dataLegendOutObject).map((d, i) => {

        return {name:d[0], nb:d[1]};

    });


    //-------------------------------------------------------------------------

    // Échelles de couleur

    const palette = {
        'Extrême gauche':"#DB1616",
        'Ecologie':"#04B34D",
        'Gauche':"#FF6DAA",
        'Droite':"#037BFC",
        'Extrême droite':"#002E61",
        'Majorité présidentielle':"#9859FC",
        'Inconnu':"#777F7F"
    };

    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------

    // PREMIÈRE PARTIE - LES CARTES

    // Création des cartes des candidats

    /// Création des container englobants (level-01)
    const containerRoot = d3.select(`#cards-container`)

    const containerIn = containerRoot
        .append("div")
        .attr("class", "cards-container");

    const containerOut = containerRoot
        .append("div")
        .attr("class", "cards-container");

    //-------------------------------------------------------------------------

    // CARTES EN COURSE

    /// Sous-containers de la partie EN COURSE (level-02)

    //// Titre
    containerIn
        .append("h1")
        .attr("class", "cards-title")
        .html("En course");
    
    //// Légende couleur et nombre de candidats
    const cardsLegendIn = containerIn
        .append("div")
        .attr("class", "cards-legend");

    //// Sous container des cartes
    const cardsSubContainerIn = containerIn
        .append("div")
        .attr("class", "cards-sub-container");

    
    /// Branchement avec les données EN COURSE

    //// Légende
    cardsLegendIn
        .selectAll("p")
        .data(dataLegendInArray)
        .join("p")
        .html(d => {

            return d.name + ': ' + d.nb;

        })
        .style("color", d => palette[d.name])
        .attr("class", "cards-legend-p");


    //// Cartes candidats
    const cardsSolo = cardsSubContainerIn
        .selectAll("div")
        .data(tidyData["en_course"])
        .join("div")
        .attr("class", "card-solo-container");

    cardsSolo
        .append("div")
        .attr("class", "card-solo-img-container")
        .style("border-color", d => palette[d.tendance]+'80')
        .on("mouseover", function(d) {
            d3.select(this)
                .style("border-color", d => palette[d.tendance])
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("border-color", d => palette[d.tendance]+'80')
            })
        .append("a")
        .attr("class", "lien-ancre")
        .attr("href", d => {return "#" + d.nom.toLowerCase()})
        .append("img")
        .attr("class", "card-solo-img")
        .attr("src", "photo_test.png");

    
    cardsSolo
        .append("p")
        .html(d => d.prenom)
        .attr("class", "card-solo-text")

     //-------------------------------------------------------------------------

    // CARTES EN HORS COURSE

    /// Sous-containers de la partie HORS COURSE (level-02)

    //// Titre
    containerOut
        .append("h1")
        .attr("class", "cards-title")
        .html("Hors course");
    
    //// Légende couleur et nombre de candidats
    const cardsLegendOut = containerOut
        .append("div")
        .attr("class", "cards-legend");

    //// Sous container des cartes
    const cardsSubContainerOut= containerOut
        .append("div")
        .attr("class", "cards-sub-container");

    
    /// Branchement avec les données EN COURSE
    console.log(dataLegendInArray)

    //// Légende
    cardsLegendOut
        .selectAll("p")
        .data(dataLegendOutArray)
        .join("p")
        .html(d => {

            return d.name + ': ' + d.nb;

        })
        .style("color", d => palette[d.name])
        .attr("class", "cards-legend-p");


    //// Cartes candidats
    const cardsSoloOut = cardsSubContainerOut
        .selectAll("div")
        .data(tidyData["hors_course"])
        .join("div")
        .attr("class", "card-solo-container");

    cardsSoloOut
        .append("div")
        .attr("class", "card-solo-img-container")
        .style("border-color", d => palette[d.tendance]+'80')
        .on("mouseover", function(d) {
            d3.select(this)
                .style("border-color", d => palette[d.tendance])
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("border-color", d => palette[d.tendance]+'80')
            })
        .append("a")
        .attr("class", "lien-ancre")
        .attr("href", d => {return "#" + d.nom.toLowerCase()})
        .append("img")
        .attr("class", "card-solo-img")
        .attr("src", "photo_test.png");

    
    cardsSoloOut
        .append("p")
        .html(d => d.prenom)
        .attr("class", "card-solo-text");


    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    
    // Forms container - EN COURSE

    // Container global - En Course
    const formsContainerIn = d3.select("#forms-container")
            .append("div")
            .attr("class", "forms-part");
    
    // Sticky-tab - En Course
    formsContainerIn
            .append("div")
            .attr("class", "tab-container")
            .append("h2")
            .html("En course")
            .attr("class", "tab-title");

    //-------------------------------------------------------------------------

    // Forms generateur - En Course
    
    // Container global de chaque fiche - En course
    const formContainerSolo = formsContainerIn
            .append("div")
            .attr("class", "forms-container")
            .selectAll("div")
            .data(tidyData["en_course"])
            .join("div")
            .attr("id", d => d.nom.toLowerCase())
            .attr("class", "form-container-solo");
    
    // Prénom, nom, âge - candidat
    formContainerSolo
            .append("h3")
            .html(d => {
                return d.nom + " " + d.prenom + " (" + d.age + " ans)"
            })
            .attr("class", "form-title");

    // Parti politique et tendance
    formContainerSolo
            .append("p")
            .html(d => d.parti + " (" + d.tendance + ")")
            .attr("class", "form-p");

    // Container - img et citation
   const formImgCitation = formContainerSolo
            .append("div")
            .attr("class", "form-img-citation");

    formImgCitation
        .append("div")
        .attr("class", "form-img-container")
        .append("img")
        .attr("class", "form-img")
        .attr("src", "photo_test.png")
        .style("border-color", d => palette[d.tendance]+'80')

    formImgCitation
        .append("p")
        .html(d => {return '"' + d.citation + '"'})
        .attr("class", "form-citation");

    // Texte resume - candidat

    formContainerSolo
            .append("p")
            .html(d => d.resume)

    //-------------------------------------------------------------------------

    // Forms container - Hors COURSE

    // Container global - Hors Course
    const formsContainerOut = d3.select("#forms-container")
            .append("div")
            .attr("class", "forms-part");
    
    // Sticky-tab - Hors Course
    formsContainerOut
            .append("div")
            .attr("class", "tab-container")
            .append("h2")
            .html("Hors course")
            .attr("class", "tab-title");

    //-------------------------------------------------------------------------
    
    // Forms generateur - Hors Course
    
    // Container global de chaque fiche - En course
    const formContainerSoloOut = formsContainerOut
            .append("div")
            .attr("class", "forms-container")
            .selectAll("div")
            .data(tidyData["hors_course"])
            .join("div")
            .attr("id", d => d.nom.toLowerCase())
            .attr("class", "form-container-solo");
    
    // Prénom, nom, âge - candidat
    formContainerSoloOut
            .append("h3")
            .html(d => {
                return d.nom + " " + d.prenom + " (" + d.age + " ans)"
            })
            .attr("class", "form-title");

    // Parti politique et tendance
    formContainerSoloOut
            .append("p")
            .html(d => d.parti + " (" + d.tendance + ")")
            .attr("class", "form-p");

    // Container - img et citation
   const formImgCitationOut = formContainerSoloOut
            .append("div")
            .attr("class", "form-img-citation");

    formImgCitationOut
        .append("div")
        .attr("class", "form-img-container")
        .append("img")
        .attr("class", "form-img")
        .attr("src", "photo_test.png")
        .style("border-color", d => palette[d.tendance]+'80')

    formImgCitationOut
        .append("p")
        .html(d => {return '"' + d.citation + '"'})
        .attr("class", "form-citation");

    // Texte resume - candidat

    formContainerSoloOut
            .append("p")
            .html(d => d.resume)


});