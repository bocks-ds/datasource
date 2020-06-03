module.exports = {
    weapon_category: {
        model_name: 'WeaponCategory',
        supports: 'weapons',
        relationshipType: 'ManyToOne',
    },
    companion_abilities: {
        model_name: "CompanionAbility",
        supports: 'companions',
        relationshipType: 'OneToMany',
    },
}