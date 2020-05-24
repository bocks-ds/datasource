module.exports = {
    weapon_categories: {
        model_name: 'WeaponCategory',
        supports: 'weapons',
        direct: true,
    },
    spell_descriptors: {
        model_name: "Descriptor",
        junction_target: 'descriptors',
        supports: 'spells',
    },
    theme_modifiers: {
        model_name: "Modifier",
        junction_target: 'modifiers',
        supports: 'themes',
    },
    class_proficiencies: {
        model_name: "Feat",
        junction_target: 'feats',
        supports: 'classes',
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
        direct: true
    },
    effect_ranges: {
        model_name: "EffectRange",
        supports: 'spells',
        direct: true,
    },
    magic_schools:  {
        model_name: "MagicSchool",
        supports: 'spells',
        direct: true,
    },
}