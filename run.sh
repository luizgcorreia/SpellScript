#!/bin/bash
# npm install -g nearley
nearleyc Spell.ne -o Spell.js
nearley-test Spell.js < script.spell