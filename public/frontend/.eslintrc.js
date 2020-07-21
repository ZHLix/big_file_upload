/*
 * @Date: 2020-04-07 22:27:26
 * @LastEditors: zhlix <15127441165@163.com>
 * @LastEditTime: 2020-04-08 08:50:51
 * @FilePath: \frozen_food_mall\.eslintrc.js
 */
module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:vue/essential'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parser': 'vue-eslint-parser',
    'parserOptions': {
        'parser': 'babel-eslint',
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'vue'
    ],
    'rules': {
        'indent': [
            'error',
            4
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}