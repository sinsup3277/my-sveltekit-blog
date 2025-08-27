import fs from 'fs';
import path from 'path';

const aliasesFilePath = path.resolve('ip-aliases.json');

/**
 * IP 별명 맵을 읽어옵니다.
 * @returns {Record<string, string>}
 */
function readAliases() {
    if (!fs.existsSync(aliasesFilePath)) {
        return {};
    }
    const fileContent = fs.readFileSync(aliasesFilePath, 'utf-8');
    try {
        return JSON.parse(fileContent);
    } catch {
        return {}; // 파일이 비어있거나 형식이 잘못된 경우
    }
}

/**
 * IP 별명 맵을 저장합니다.
 * @param {Record<string, string>} aliases 
 */
function writeAliases(aliases) {
    fs.writeFileSync(aliasesFilePath, JSON.stringify(aliases, null, 2));
}

/**
 * 모든 IP 별명 목록을 가져옵니다.
 */
export function getAliases() {
    return readAliases();
}

/**
 * IP 주소에 해당하는 표시 이름을 가져옵니다. 별명이 없으면 IP를 그대로 반환합니다.
 * @param {string} ip 
 */
export function getDisplayName(ip) {
    if (!ip) return 'Unknown';
    const aliases = readAliases();
    return aliases[ip] || ip;
}

/**
 * IP 주소에 대한 별명을 설정합니다. (추가/수정)
 * @param {string} ip 
 * @param {string} name 
 */
export function setAlias(ip, name) {
    const aliases = readAliases();
    aliases[ip] = name;
    writeAliases(aliases);
}

/**
 * IP 주소에 대한 별명을 삭제합니다.
 * @param {string} ip 
 */
export function deleteAlias(ip) {
    const aliases = readAliases();
    delete aliases[ip];
    writeAliases(aliases);
}