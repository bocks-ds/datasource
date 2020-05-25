module.exports = {
    weapon_categories: {
        model_name: 'WeaponCategory',
        supports: 'weapons',
        relationshipType: 'ManyToOne',
    },
    spell_descriptors: {
        model_name: "Descriptor",
        joins_to: 'descriptors',
        supports: 'spells',
        relationshipType: "ManyToMany",
    },
    theme_modifiers: {
        model_name: "Modifier",
        joins_to: 'modifiers',
        supports: 'themes',
        relationshipType: "ManyToMany",
    },
    class_proficiencies: {
        model_name: "Feat",
        joins_to: 'feats',
        supports: 'classes',
        relationshipType: "ManyToMany",
    },
    class_features: {
        model_name: "ClassFeature",
        supports: 'classes',
    },
    class_special_skills: {
        model_name: "ClassSpecialSkills",
        supports: 'class_features',
    },
    abilities: {
        model_name: "Ability",
        supports: 'classes',
        relationshipType: 'ManyToOne',
    },
    effect_ranges: {
        model_name: "EffectRange",
        supports: 'spells',
        relationshipType: 'ManyToOne',
    },
    magic_schools:  {
        model_name: "MagicSchool",
        supports: 'spells',
        relationshipType: 'ManyToOne',
    },
}