var userScore = {

    meteorAvoided: 0,   

    getMeteorAvoided: function () {
        return this.meteorAvoided;
    },

    addMeteorAvoided: function () {
        this.meteorAvoided++;
    },

    resetScore: function () {
        this.meteorAvoided = 0;
    },
};
