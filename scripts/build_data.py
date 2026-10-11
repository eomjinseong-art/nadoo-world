#!/usr/bin/env python3
"""Bundle country facts for 나두세계. Reads data/raw and writes data/countries.json.

Sources (retrieved 2026-10-11):
- mledoze/countries (ODbL): names, ISO, area, capitals list, languages, currency, calling code, region
- World Bank SP.POP.TOTL 2025: population for ranked figures
- Wikidata (CC0): capital coordinates and Korean capital labels; Taiwan and Vatican population point-in-time
- countries-and-timezones data (IANA zones)
- Pew Research Center via datahub world-religion-projections (CC BY 4.0): 2020 rounded shares from the 2015 projections
"""

from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = ROOT / "data" / "countries.json"

NAME_KO = {
    "KR": "대한민국",
    "KP": "조선민주주의인민공화국",
    "DM": "도미니카 연방",
    "DO": "도미니카 공화국",
    "TR": "튀르키예",
    "MN": "몽골",
    "CG": "콩고 공화국",
    "CD": "콩고민주공화국",
    "CI": "코트디부아르",
    "US": "미국",
    "GB": "영국",
    "CZ": "체코",
    "LA": "라오스",
    "MM": "미얀마",
    "SZ": "에스와티니",
    "CV": "카보베르데",
    "TL": "동티모르",
    "MK": "북마케도니아",
    "GE": "조지아",
    "VA": "바티칸",
    "ZA": "남아프리카공화국",
    "FM": "미크로네시아 연방",
    "PS": "팔레스타인",
    "TW": "대만",
    "XK": "코소보",
    "NR": "나우루",
}

NAME_EN = {
    "CI": "Côte d'Ivoire",
    "KR": "South Korea",
    "KP": "North Korea",
    "US": "United States",
    "GB": "United Kingdom",
    "CZ": "Czechia",
    "TR": "Türkiye",
}

REGION_KO = {
    "Africa": "아프리카",
    "Americas": "아메리카",
    "Asia": "아시아",
    "Europe": "유럽",
    "Oceania": "오세아니아",
}

SUB_KO = {
    "Eastern Asia": "동아시아",
    "South-Eastern Asia": "동남아시아",
    "Southern Asia": "남아시아",
    "Central Asia": "중앙아시아",
    "Western Asia": "서아시아",
    "Northern Europe": "북유럽",
    "Western Europe": "서유럽",
    "Southern Europe": "남유럽",
    "Eastern Europe": "동유럽",
    "Central Europe": "중유럽",
    "Southeast Europe": "남동유럽",
    "Northern Africa": "북아프리카",
    "Western Africa": "서아프리카",
    "Middle Africa": "중앙아프리카",
    "Eastern Africa": "동아프리카",
    "Southern Africa": "남아프리카",
    "North America": "북아메리카",
    "Central America": "중앙아메리카",
    "Caribbean": "카리브",
    "South America": "남아메리카",
    "Australia and New Zealand": "오스트레일리아·뉴질랜드",
    "Melanesia": "멜라네시아",
    "Micronesia": "미크로네시아",
    "Polynesia": "폴리네시아",
}

LANG_KO = {
    "Afrikaans": "아프리칸스어",
    "Albanian": "알바니아어",
    "Amharic": "암하라어",
    "Arabic": "아랍어",
    "Aramaic": "아람어",
    "Armenian": "아르메니아어",
    "Austro-Bavarian German": "오스트로바이에른 독일어",
    "Aymara": "아이마라어",
    "Azerbaijani": "아제르바이잔어",
    "Belarusian": "벨라루스어",
    "Belizean Creole": "벨리즈 크리올",
    "Bengali": "벵골어",
    "Berber": "베르베르어",
    "Bislama": "비슬라마어",
    "Bosnian": "보스니아어",
    "Bulgarian": "불가리아어",
    "Burmese": "버마어",
    "Catalan": "카탈루냐어",
    "Chewa": "체와어",
    "Chibarwe": "치바르웨어",
    "Chinese": "중국어",
    "Comorian": "코모로어",
    "Croatian": "크로아티아어",
    "Czech": "체코어",
    "Danish": "덴마크어",
    "Dari": "다리어",
    "Dutch": "네덜란드어",
    "Dzongkha": "종카어",
    "English": "영어",
    "Estonian": "에스토니아어",
    "Fiji Hindi": "피지 힌디어",
    "Fijian": "피지어",
    "Filipino": "필리핀어",
    "Finnish": "핀란드어",
    "French": "프랑스어",
    "Georgian": "조지아어",
    "German": "독일어",
    "Gilbertese": "키리바시어",
    "Greek": "그리스어",
    "Guaraní": "과라니어",
    "Haitian Creole": "아이티 크리올",
    "Hebrew": "히브리어",
    "Herero": "헤레로어",
    "Hindi": "힌디어",
    "Hiri Motu": "히리모투어",
    "Hungarian": "헝가리어",
    "Icelandic": "아이슬란드어",
    "Indonesian": "인도네시아어",
    "Irish": "아일랜드어",
    "Italian": "이탈리아어",
    "Jamaican Patois": "자메이카 크레올",
    "Japanese": "일본어",
    "Kalanga": "칼랑가어",
    "Kazakh": "카자흐어",
    "Khmer": "크메르어",
    "Khoekhoe": "코에코에어",
    "Khoisan": "코이산어",
    "Kikongo": "콩고어",
    "Kinyarwanda": "키냐르완다어",
    "Kirundi": "키룬디어",
    "Korean": "한국어",
    "Kwangali": "쿠왕갈리어",
    "Kyrgyz": "키르기스어",
    "Lao": "라오어",
    "Latin": "라틴어",
    "Latvian": "라트비아어",
    "Lingala": "링갈라어",
    "Lithuanian": "리투아니아어",
    "Lozi": "로지어",
    "Luxembourgish": "룩셈부르크어",
    "Macedonian": "마케도니아어",
    "Malagasy": "말라가시어",
    "Malay": "말레이어",
    "Maldivian": "디베히어",
    "Maltese": "몰타어",
    "Marshallese": "마셜어",
    "Mauritian Creole": "모리셔스 크리올",
    "Moldavian": "몰도바어",
    "Mongolian": "몽골어",
    "Montenegrin": "몬테네그로어",
    "Māori": "마오리어",
    "Nauru": "나우루어",
    "Ndau": "은다우어",
    "Ndonga": "은동가어",
    "Nepali": "네팔어",
    "New Zealand Sign Language": "뉴질랜드 수화",
    "Northern Ndebele": "북부 은데벨레어",
    "Northern Sotho": "북부 소토어",
    "Norwegian Bokmål": "노르웨이어 보크몰",
    "Norwegian Nynorsk": "노르웨이어 뉘노르스크",
    "Palauan": "팔라우어",
    "Pashto": "파슈토어",
    "Persian (Farsi)": "페르시아어",
    "Polish": "폴란드어",
    "Portuguese": "포르투갈어",
    "Quechua": "케추아어",
    "Romanian": "루마니아어",
    "Romansh": "로만슈어",
    "Russian": "러시아어",
    "Sami": "사미어",
    "Samoan": "사모아어",
    "Sango": "상고어",
    "Serbian": "세르비아어",
    "Seychellois Creole": "세이셸 크리올",
    "Shona": "쇼나어",
    "Sinhala": "싱할라어",
    "Slovak": "슬로바키아어",
    "Slovene": "슬로베니아어",
    "Somali": "소말리어",
    "Sorani": "소라니어",
    "Sotho": "소토어",
    "Southern Ndebele": "남부 은데벨레어",
    "Southern Sotho": "남부 소토어",
    "Spanish": "스페인어",
    "Swahili": "스와힐리어",
    "Swazi": "스와티어",
    "Swedish": "스웨덴어",
    "Swiss German": "스위스 독일어",
    "Tajik": "타지크어",
    "Tamil": "타밀어",
    "Tetum": "테툼어",
    "Thai": "태국어",
    "Tigrinya": "티그리냐어",
    "Tok Pisin": "톡 피신",
    "Tonga": "통가어(치통가)",
    "Tongan": "통가어",
    "Tshiluba": "칠루바어",
    "Tsonga": "총가어",
    "Tswana": "츠와나어",
    "Turkish": "튀르키예어",
    "Turkmen": "투르크멘어",
    "Tuvaluan": "투발루어",
    "Ukrainian": "우크라이나어",
    "Upper Guinea Creole": "기니비사우 크리올",
    "Urdu": "우르두어",
    "Uzbek": "우즈베크어",
    "Venda": "벤다어",
    "Vietnamese": "베트남어",
    "Xhosa": "코사어",
    "Zimbabwean Sign Language": "짐바브웨 수화",
    "Zulu": "줄루어",
}

LANG_NOTES = {
    "AT": "오스트리아의 공용어는 독일어입니다. 이 자료의 언어 이름은 Austro-Bavarian German입니다.",
    "CH": "스위스의 공용어는 독일어·프랑스어·이탈리아어·로만슈어입니다. 자료에는 표준 독일어 대신 스위스 독일어가 올라가 있습니다.",
    "MD": "자료의 언어 이름은 Moldavian입니다. 루마니아어와 같은 말로 보는 견해가 일반적입니다.",
    "IN": "인도 헌법의 공용어는 이 목록보다 많습니다. 여기에는 데이터셋에 올라 있는 이름만 적습니다.",
    "ZA": "남아프리카공화국 헌법의 공용어는 많습니다. 데이터셋에 있는 이름을 모두 적었습니다.",
    "BO": "볼리비아의 공용어는 스페인어 외에도 여러 원주민 언어입니다. 데이터셋에 있는 이름만 적습니다.",
    "ZW": "짐바브웨 헌법의 공용어는 많습니다. 데이터셋에 있는 이름만 적습니다.",
}

CURRENCY_KO = {
    "USD": "미국 달러",
    "EUR": "유로",
    "GBP": "파운드",
    "JPY": "엔",
    "KRW": "원",
    "CNY": "위안",
    "INR": "루피",
    "RUB": "루블",
    "BRL": "레알",
    "CAD": "캐나다 달러",
    "AUD": "호주 달러",
    "CHF": "스위스 프랑",
    "SEK": "스웨덴 크로나",
    "NOK": "노르웨이 크로네",
    "DKK": "덴마크 크로네",
    "PLN": "즈워티",
    "TRY": "리라",
    "MXN": "멕시코 페소",
    "ZAR": "랜드",
    "IDR": "루피아",
    "THB": "바트",
    "VND": "동",
    "PHP": "필리핀 페소",
    "MYR": "링깃",
    "SGD": "싱가포르 달러",
    "NZD": "뉴질랜드 달러",
    "HKD": "홍콩 달러",
    "TWD": "신타이완 달러",
    "SAR": "리얄",
    "AED": "디르함",
    "QAR": "카타르 리얄",
    "KWD": "쿠웨이트 디나르",
    "BHD": "바레인 디나르",
    "OMR": "오만 리알",
    "ILS": "세켈",
    "EGP": "이집트 파운드",
    "NGN": "나이라",
    "KES": "케냐 실링",
    "GHS": "세디",
    "XOF": "서아프리카 CFA 프랑",
    "XAF": "중앙아프리카 CFA 프랑",
    "XPF": "CFP 프랑",
    "MAD": "모로코 디르함",
    "DZD": "알제리 디나르",
    "TND": "튀니지 디나르",
    "ARS": "아르헨티나 페소",
    "CLP": "칠레 페소",
    "COP": "콜롬비아 페소",
    "PEN": "솔",
    "VES": "볼리바르",
    "UYU": "우루과이 페소",
    "PYG": "과라니",
    "BOB": "볼리비아노",
    "CRC": "코스타리카 콜론",
    "GTQ": "케찰",
    "HNL": "렘피라",
    "NIO": "코르도바",
    "PAB": "발보아",
    "DOP": "도미니카 페소",
    "CUP": "쿠바 페소",
    "JMD": "자메이카 달러",
    "TTD": "트리니다드 토바고 달러",
    "BBD": "바베이도스 달러",
    "BSD": "바하마 달러",
    "BZD": "벨리즈 달러",
    "GYD": "가이아나 달러",
    "SRD": "수리남 달러",
    "HTG": "구르드",
    "ISK": "아이슬란드 크로나",
    "CZK": "코루나",
    "HUF": "포린트",
    "RON": "레우",
    "BGN": "레프",
    "RSD": "세르비아 디나르",
    "HRK": "쿠나",
    "UAH": "흐리우냐",
    "BYN": "벨라루스 루블",
    "MDL": "몰도바 레우",
    "ALL": "레크",
    "MKD": "데나르",
    "BAM": "태환 마르카",
    "GEL": "라리",
    "AMD": "드람",
    "AZN": "마나트",
    "KZT": "텡게",
    "UZS": "숨",
    "TJS": "소모니",
    "TMT": "마나트",
    "KGS": "솜",
    "MNT": "투그릭",
    "KPW": "조선민주주의인민공화국 원",
    "LAK": "킵",
    "KHR": "리엘",
    "MMK": "짯",
    "BDT": "타카",
    "PKR": "파키스탄 루피",
    "LKR": "스리랑카 루피",
    "NPR": "네팔 루피",
    "BTN": "눌트럼",
    "AFN": "아프가니",
    "IRR": "리알",
    "IQD": "이라크 디나르",
    "SYP": "시리아 파운드",
    "JOD": "요르단 디나르",
    "LBP": "레바논 파운드",
    "YER": "예멘 리알",
    "ETB": "비르",
    "TZS": "탄자니아 실링",
    "UGX": "우간다 실링",
    "RWF": "르완다 프랑",
    "BIF": "부룬디 프랑",
    "SOS": "소말리아 실링",
    "DJF": "지부티 프랑",
    "ERN": "낙파",
    "SDG": "수단 파운드",
    "SSP": "남수단 파운드",
    "LYD": "리비아 디나르",
    "MRU": "우기야",
    "MGA": "아리아리",
    "MUR": "모리셔스 루피",
    "SCR": "세이셸 루피",
    "KMF": "코모로 프랑",
    "MZN": "메티칼",
    "AOA": "콴자",
    "ZMW": "잠비아 콰차",
    "ZWL": "짐바브웨 달러",
    "ZWB": "짐바브웨 채권",
    "MWK": "말라위 콰차",
    "TVD": "투발루 달러",
    "CUC": "쿠바 태환 페소",
    "CUP": "쿠바 페소",
    "BWP": "풀라",
    "NAD": "나미비아 달러",
    "SZL": "릴랑게니",
    "LSL": "로티",
    "MOP": "파타카",
    "MVR": "루피야",
    "BND": "브루나이 달러",
    "FJD": "피지 달러",
    "WST": "탈라",
    "TOP": "파앙가",
    "VUV": "바투",
    "SBD": "솔로몬 제도 달러",
    "PGK": "키나",
    "KID": "키리바시 달러",
    "AUD_KI": "호주 달러",
    "STN": "도브라",
    "CVE": "카보베르데 에스쿠도",
    "GMD": "달라시",
    "GNF": "기니 프랑",
    "SLL": "레오네",
    "SLE": "레오네",
    "LRD": "라이베리아 달러",
    "CDF": "콩고 프랑",
    "XCD": "동카리브 달러",
    "AWG": "아루바 플로린",
    "ANG": "안틸레스 휠던",
    "FKP": "포클랜드 파운드",
    "SHP": "세인트헬레나 파운드",
    "IMP": "맨섬 파운드",
    "JEP": "저지 파운드",
    "GGP": "건지 파운드",
    "KYD": "케이맨 달러",
    "BMD": "버뮤다 달러",
}

AREA_NOTES = {
    "FR": "데이터셋의 프랑스 면적은 551,695km²입니다. 유럽 본토(코르시카 포함) 규모이고, 해외 영토는 따로인 경우가 많습니다.",
    "DK": "이 면적은 덴마크 본토에 가깝습니다. 그린란드와 페로 제도는 들어 있지 않습니다.",
    "CN": "대만은 별도 카드로 둡니다. 이 면적 숫자에 대만이 들어 있는지는 자료가 말하지 않아, 더하거나 빼지 않습니다.",
    "US": "해외 속령을 모두 더한 값인지는 자료마다 다릅니다. 데이터셋 숫자를 그대로 씁니다.",
}

CURRENCY_NOTES = {
    "CU": "자료에는 2021년 폐지된 태환 페소(CUC)가 남아 있어 목록에서 빼었습니다. 통화는 쿠바 페소(CUP)로 적습니다.",
    "ZW": "자료에는 여러 외국 통화와 짐바브웨 채권이 함께 있습니다. 짐바브웨 통화는 자주 바뀌었고 2024년에 짐바브웨 골드(ZiG)가 도입되었으므로, 이 목록만으로 지금 쓰는 돈을 단정하지 않습니다.",
    "TV": "투발루는 호주 달러를 쓰고, 자료에는 투발루 달러도 함께 올라가 있습니다.",
}

XK_ZONE = {
    "id": "Europe/Belgrade",
    "stdMin": 60,
    "dstMin": 120,
    "stdLabel": "UTC+1",
    "dstLabel": "UTC+2",
    "diffStd": "한국보다 8시간 느립니다",
    "diffDst": "한국보다 7시간 느립니다",
}

TZ_NOTES = {
    "XK": "이 시간대 파일에는 XK가 없습니다. 코소보는 중앙유럽 표준시(UTC+1, 여름 UTC+2)를 씁니다.",
    "FR": "이 목록은 ISO 코드 FR에 연결된 시간대입니다. 해외 영토는 GF·GP·PF처럼 다른 코드로 나뉩니다. 그 영토까지 세면 프랑스의 시간대가 가장 많다고 흔히 말하며, 12개라는 소개가 널리 쓰입니다.",
    "CN": "중국의 공식 표준시는 UTC+8 하나입니다. IANA에는 신장의 Asia/Urumqi(UTC+6)도 있어, 여기 목록에 같이 나올 수 있습니다.",
    "RU": "표준시 오프셋은 11개입니다. IANA 시간대 이름은 같은 오프셋 안에서도 여럿이라 더 많습니다.",
    "US": "본토와 해외 속령이 한 ISO 코드에 같이 들어 있습니다. 화면에는 표준시 오프셋으로 묶었습니다.",
    "AU": "본토와 해외 영토의 시간대가 함께 있습니다. 표준시 오프셋으로 묶었습니다.",
    "GB": "영국 본토는 그리니치 표준시(겨울)와 영국 일광절약시간(여름)입니다. 해외 영토는 다른 ISO 코드입니다.",
}

CAPITAL_ROLES = {
    "ZA": {
        "Pretoria": "행정 수도",
        "Cape Town": "입법 수도",
        "Bloemfontein": "사법 수도",
    },
    "BO": {"Sucre": "헌법상 수도", "La Paz": "정부 소재지"},
    "NL": {"Amsterdam": "헌법상 수도", "The Hague": "정부 소재지"},
    "SZ": {"Mbabane": "행정 수도", "Lobamba": "입법·왕실 소재"},
    "LK": {
        "Sri Jayawardenepura Kotte": "공식 수도(입법)",
        "Colombo": "상업·행정 기능이 큰 도시",
    },
    "MY": {"Kuala Lumpur": "공식 수도", "Putrajaya": "행정 수도"},
    "BJ": {"Porto-Novo": "공식 수도", "Cotonou": "정부 소재지"},
    "CI": {"Yamoussoukro": "공식 수도", "Abidjan": "사실상 행정·경제 중심"},
    "PS": {
        "East Jerusalem": "팔레스타인이 수도로 밝히는 곳",
        "Ramallah": "자치 정부의 행정 중심",
    },
    "IL": {"Jerusalem": "이스라엘이 수도로 두는 곳"},
    "CH": {"Bern": "연방시"},
    "NR": {"Yaren District": "정부 소재 구역"},
    "GQ": {"Ciudad de la Paz": "새 수도로 지정된 도시", "Malabo": "정부가 있는 수도"},
}

EXTRA_CAPITALS = [
    {"iso": "NL", "en": "The Hague", "ko": "헤이그", "lat": 52.08, "lon": 4.31, "role": "정부 소재지"},
    {"iso": "MY", "en": "Putrajaya", "ko": "푸트라자야", "lat": 2.93, "lon": 101.69, "role": "행정 수도"},
    {"iso": "BJ", "en": "Cotonou", "ko": "코토누", "lat": 6.3666666666667, "lon": 2.4166666666667, "role": "정부 소재지"},
    {"iso": "CI", "en": "Abidjan", "ko": "아비장", "lat": 5.3363888888889, "lon": -4.0266666666667, "role": "사실상 행정·경제 중심"},
    {"iso": "TW", "en": "Taipei", "ko": "타이베이", "lat": 25.0375, "lon": 121.5625, "role": "수도"},
    {"iso": "GQ", "en": "Malabo", "ko": "말라보", "lat": 3.7523, "lon": 8.7737, "role": "정부가 있는 수도"},
]

TIDY_KO = {
    "서울특별시": "서울",
    "도쿄도": "도쿄",
    "베이징시": "베이징",
    "타이베이시": "타이베이",
    "평양직할시": "평양",
    "바티칸 시국": "바티칸",
    "워싱턴 D.C.": "워싱턴 D.C.",
    "야렌구": "야렌",
    "세인트존스": "세인트존스",
}

SPECIAL_POP = {
    "TW": {
        "value": 23262544,
        "year": 2026,
        "asOf": "2026-04-01",
        "source": "wikidata",
        "note": "세계은행 SP.POP.TOTL에는 대만이 없습니다. 위키데이터 P1082의 2026-04-01 값 23,262,544를 적습니다. 유엔 회원국 인구 순위에는 넣지 않습니다.",
    },
    "VA": {
        "value": 882,
        "year": 2024,
        "asOf": "2024-12-31",
        "source": "wikidata",
        "note": "세계은행 총인구에 바티칸이 없습니다. 위키데이터 P1082의 2024-12-31 값 882를 적습니다. 시민과 거주자를 어떻게 세는지에 따라 다른 숫자가 같이 있어, 인구 순위에는 넣지 않습니다.",
    },
}

STATUS = {
    "VA": ("observer", "유엔 옵서버(비회원)"),
    "PS": ("observer", "유엔 비회원 옵서버"),
    "TW": ("partial", "유엔 비회원 · 일부 국가만 승인"),
    "XK": ("partial", "유엔 비회원 · 일부 국가만 승인"),
}

REL_KO = {
    "Buddhists": "불교",
    "Christians": "기독교",
    "Folk Religions": "민속 종교",
    "Hindus": "힌두교",
    "Jews": "유대교",
    "Muslims": "이슬람",
    "Other Religions": "그 밖의 종교",
    "Unaffiliated": "무종교",
}

REL_ALIAS = {
    "South Korea": "KR",
    "North Korea": "KP",
    "United States": "US",
    "Russia": "RU",
    "Czech Republic": "CZ",
    "Czechia": "CZ",
    "Ivory Coast": "CI",
    "Cote d'Ivoire": "CI",
    "Côte d'Ivoire": "CI",
    "Republic of the Congo": "CG",
    "Congo": "CG",
    "Democratic Republic of the Congo": "CD",
    "DR Congo": "CD",
    "Tanzania": "TZ",
    "Syria": "SY",
    "Palestine": "PS",
    "West Bank and Gaza": "PS",
    "Taiwan": "TW",
    "Vatican City": "VA",
    "Holy See": "VA",
    "Kosovo": "XK",
    "Eswatini": "SZ",
    "Swaziland": "SZ",
    "Myanmar": "MM",
    "Burma": "MM",
    "Laos": "LA",
    "Cape Verde": "CV",
    "Cabo Verde": "CV",
    "Turkey": "TR",
    "Türkiye": "TR",
    "United Kingdom": "GB",
    "Slovakia": "SK",
    "Slovak Republic": "SK",
    "Kyrgyzstan": "KG",
    "Macedonia": "MK",
    "North Macedonia": "MK",
    "Brunei": "BN",
    "Gambia": "GM",
    "The Gambia": "GM",
    "Bahamas": "BS",
    "The Bahamas": "BS",
    "Micronesia": "FM",
    "Sao Tome and Principe": "ST",
    "São Tomé and Príncipe": "ST",
    "Timor-Leste": "TL",
    "East Timor": "TL",
    "Vietnam": "VN",
    "Viet Nam": "VN",
    "Bolivia": "BO",
    "Venezuela": "VE",
    "Iran": "IR",
    "Moldova": "MD",
    "Tanzania, United Republic of": "TZ",
    "Korea, South": "KR",
    "Korea, North": "KP",
    "Republic of Korea": "KR",
    "Brunei Darussalam": "BN",
    "Lao PDR": "LA",
    "Syrian Arab Republic": "SY",
    "Bosnia-Herzegovina": "BA",
    "Burma (Myanmar)": "MM",
    "Palestinian territories": "PS",
    "Republic of Macedonia": "MK",
    "St. Kitts and Nevis": "KN",
    "St. Lucia": "LC",
    "St. Vincent and the Grenadines": "VC",
}

FILM_LANES = {
    "egypt": ["EG"],
    "israel": ["IL"],
    "greece": ["GR"],
    "persia": ["IR"],
    "rome": ["IT"],
    "korea": ["KR"],
}


def tidy_capital(ko: str, en: str) -> str:
    if ko in TIDY_KO:
        return TIDY_KO[ko]
    if ko.endswith("특별시") or ko.endswith("광역시"):
        return ko.replace("특별시", "").replace("광역시", "")
    if ko.endswith("직할시") and len(ko) > 3:
        return ko[: -3]
    if ko.endswith("시") and len(ko) >= 3 and "City" not in en and not ko.endswith("D.C."):
        return ko[:-1]
    return ko


def offset_label(minutes: int) -> str:
    sign = "+" if minutes >= 0 else "-"
    minutes = abs(minutes)
    h, m = divmod(minutes, 60)
    if m:
        return f"UTC{sign}{h}:{m:02d}"
    return f"UTC{sign}{h}"


def diff_text(country_min: int, korea: int = 540) -> str:
    delta = country_min - korea
    if delta == 0:
        return "한국과 같습니다"
    minutes = abs(delta)
    h, m = divmod(minutes, 60)
    if h and m:
        part = f"{h}시간 {m}분"
    elif h:
        part = f"{h}시간"
    else:
        part = f"{m}분"
    if delta > 0:
        return f"한국보다 {part} 빠릅니다"
    return f"한국보다 {part} 느립니다"


def calling_code(idd: dict) -> str | None:
    root = idd.get("root") or ""
    suffixes = idd.get("suffixes") or []
    if not root:
        return None
    if len(suffixes) == 1:
        return f"{root}{suffixes[0]}"
    if not suffixes:
        return root
    if all(not s for s in suffixes):
        return root
    shown = ", ".join(f"{root}{s}" for s in suffixes[:6])
    if len(suffixes) > 6:
        shown += " 외"
    return shown


EN_FALLBACK = {"AG": "Saint John's"}


def load_capitals() -> dict[str, list[dict]]:
    raw = json.loads((RAW / "wikidata-capitals.json").read_text())
    by: dict[str, list[dict]] = defaultdict(list)
    seen: dict[str, set[str]] = defaultdict(set)
    for row in raw["results"]["bindings"]:
        iso = row["iso"]["value"]
        en = row.get("capEn", {}).get("value") or EN_FALLBACK.get(iso) or ""
        ko = row.get("capKo", {}).get("value") or ""
        if not en and not ko:
            continue
        if not en:
            en = ko
        if en in seen[iso]:
            continue
        seen[iso].add(en)
        ko = ko or en
        by[iso].append(
            {
                "en": en,
                "ko": tidy_capital(ko, en),
                "lat": round(float(row["lat"]["value"]), 4),
                "lon": round(float(row["lon"]["value"]), 4),
                "role": CAPITAL_ROLES.get(iso, {}).get(en, "수도"),
            }
        )
    for extra in EXTRA_CAPITALS:
        iso = extra["iso"]
        if extra["en"] in seen[iso]:
            for cap in by[iso]:
                if cap["en"] == extra["en"]:
                    cap["role"] = extra["role"]
            continue
        seen[iso].add(extra["en"])
        by[iso].append(
            {
                "en": extra["en"],
                "ko": extra["ko"],
                "lat": round(extra["lat"], 4),
                "lon": round(extra["lon"], 4),
                "role": extra["role"],
            }
        )
    if "GQ" in by:
        by["GQ"].sort(key=lambda cap: 0 if cap["en"] == "Malabo" else 1)
    return by


def load_timezones() -> dict[str, list[dict]]:
    raw = json.loads((RAW / "timezones.json").read_text())
    by: dict[str, list[dict]] = defaultdict(list)
    for name, info in raw["timezones"].items():
        if info.get("a"):
            continue
        std = info.get("u")
        if std is None:
            continue
        dst = info.get("d")
        for iso in info.get("c") or []:
            by[iso].append(
                {
                    "id": name,
                    "stdMin": std,
                    "dstMin": dst,
                    "stdLabel": offset_label(std),
                    "dstLabel": offset_label(dst) if dst is not None and dst != std else None,
                    "diffStd": diff_text(std),
                    "diffDst": diff_text(dst) if dst is not None and dst != std else None,
                }
            )
    for iso, zones in by.items():
        zones.sort(key=lambda z: (z["stdMin"], z["id"]))
    return by


def load_religion(name_to_iso: dict[str, str]) -> dict[str, list[dict]]:
    by: dict[str, list[dict]] = {}
    unmatched = []
    with (RAW / "religion-pew2015-rounded.csv").open(encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if row["Year"] != "2020" or row["Country"] == "All Countries":
                continue
            iso = REL_ALIAS.get(row["Country"]) or name_to_iso.get(row["Country"])
            if not iso:
                unmatched.append(row["Country"])
                continue
            items = []
            for key, ko in REL_KO.items():
                pct = float(row[key])
                items.append({"key": key, "ko": ko, "pct": pct, "atMostOne": pct == 1.0})
            items.sort(key=lambda item: (-item["pct"], item["ko"]))
            by[iso] = items
    study_miss = [name for name in sorted(set(unmatched)) if REL_ALIAS.get(name) or name_to_iso.get(name)]
    if study_miss:
        print("religion unmatched study", study_miss)
    return by


def load_films() -> dict[str, list[dict]]:
    films = json.loads((RAW / "films.json").read_text())
    by: dict[str, list[dict]] = defaultdict(list)
    for film in films:
        isos = []
        for lane in film.get("lanes") or []:
            isos.extend(FILM_LANES.get(lane, []))
        item = {
            "id": film["id"],
            "koTitle": film["koTitle"],
            "originalTitle": film.get("originalTitle") or "",
            "year": film.get("year"),
            "type": film.get("type") or "",
        }
        for iso in dict.fromkeys(isos):
            by[iso].append(item)
    return by


def main() -> None:
    raw_countries = json.loads((RAW / "mledoze-countries.json").read_text())
    wb = json.loads((RAW / "wb-pop-2025.json").read_text())["byIso3"]
    capitals = load_capitals()
    zones = load_timezones()

    study = []
    for country in raw_countries:
        iso = country["cca2"]
        un_flag = bool(country["unMember"]) and iso != "VA"
        if not un_flag and iso not in {"VA", "PS", "TW", "XK"}:
            continue
        study.append(country)

    un_count = sum(1 for c in study if c["unMember"] and c["cca2"] != "VA")
    if un_count != 193:
        raise SystemExit(f"expected 193 UN members, got {un_count}")
    if len(study) != 197:
        raise SystemExit(f"expected 197 study countries, got {len(study)}")

    name_to_iso = {}
    for country in study:
        name_to_iso[country["name"]["common"]] = country["cca2"]
        name_to_iso[country["name"]["official"]] = country["cca2"]
    religions = load_religion(name_to_iso)
    films = load_films()

    missing_lang = set()
    missing_currency = set()
    records = []
    for country in study:
        iso = country["cca2"]
        kor = country["translations"].get("kor") or {}
        status, status_ko = STATUS.get(iso, ("un", "유엔 회원국"))
        languages = []
        for name in country["languages"].values():
            ko = LANG_KO.get(name)
            if not ko:
                missing_lang.add(name)
                ko = name
            languages.append({"en": name, "ko": ko})
        currencies = []
        for code, info in (country.get("currencies") or {}).items():
            if iso == "CU" and code == "CUC":
                continue
            ko = CURRENCY_KO.get(code)
            if not ko:
                missing_currency.add(f"{code}:{info.get('name')}")
                ko = info.get("name") or code
            currencies.append(
                {"code": code, "name": info.get("name") or code, "ko": ko, "symbol": info.get("symbol") or ""}
            )
        iso3 = country["cca3"]
        pop_source = "worldbank"
        pop_note = "세계은행 총인구 지표 SP.POP.TOTL의 2025년 값입니다. 2026-10-11에 받아 두었고, 중간 연도 추계가 섞일 수 있습니다."
        pop_as_of = "2025"
        pop_year = 2025
        ranked_pop = True
        if iso == "XK":
            wb_row = wb.get("XKX")
        else:
            wb_row = wb.get(iso3)
        if iso in SPECIAL_POP:
            spec = SPECIAL_POP[iso]
            population = spec["value"]
            pop_year = spec["year"]
            pop_as_of = spec["asOf"]
            pop_source = spec["source"]
            pop_note = spec["note"]
            ranked_pop = False
        elif wb_row:
            population = wb_row["value"]
            pop_year = wb_row["year"]
        else:
            population = None
            ranked_pop = False
            pop_note = "이 나라의 인구는 세계은행 SP.POP.TOTL에서 찾지 못했습니다."
        area = country["area"]
        density = round(population / area, 2) if population and area else None
        caps = capitals.get(iso) or []
        if not caps:
            raise SystemExit(f"missing capital for {iso}")
        sub = country["subregion"]
        if sub not in SUB_KO:
            raise SystemExit(f"missing subregion {sub}")
        ccn3 = str(country.get("ccn3") or "").zfill(3) if country.get("ccn3") else ""
        records.append(
            {
                "iso2": iso,
                "iso3": iso3,
                "ccn3": ccn3,
                "nameKo": NAME_KO.get(iso) or kor.get("common") or country["name"]["common"],
                "nameKoOfficial": kor.get("official") or NAME_KO.get(iso) or country["name"]["official"],
                "nameEn": NAME_EN.get(iso) or country["name"]["common"],
                "nameEnOfficial": country["name"]["official"],
                "status": status,
                "statusKo": status_ko,
                "region": country["region"],
                "regionKo": REGION_KO[country["region"]],
                "subregion": sub,
                "subregionKo": SUB_KO[sub],
                "landlocked": bool(country["landlocked"]),
                "areaKm2": area,
                "areaNote": AREA_NOTES.get(iso),
                "population": population,
                "populationYear": pop_year,
                "populationAsOf": pop_as_of,
                "populationSource": pop_source,
                "populationRanked": ranked_pop,
                "populationNote": pop_note,
                "density": density,
                "capitals": caps,
                "languages": languages,
                "languageNote": LANG_NOTES.get(iso),
                "religions": religions.get(iso, []),
                "currencies": currencies,
                "currencyNote": CURRENCY_NOTES.get(iso),
                "timezones": zones.get(iso) or ([XK_ZONE] if iso == "XK" else []),
                "tzNote": TZ_NOTES.get(iso),
                "callingCode": calling_code(country.get("idd") or {}),
                "latlng": country.get("latlng") or [],
                "borders": country.get("borders") or [],
                "films": films.get(iso, []),
            }
        )

    if missing_lang:
        raise SystemExit(f"missing language names: {sorted(missing_lang)}")
    if missing_currency:
        print("currency fallback", sorted(missing_currency))

    def area_key(row: dict) -> float:
        return row["areaKm2"] or 0

    by_area = sorted(records, key=area_key, reverse=True)
    for i, row in enumerate(by_area, start=1):
        row["areaRank"] = i
    ranked_rows = [row for row in records if row["populationRanked"] and row["population"]]
    for i, row in enumerate(sorted(ranked_rows, key=lambda r: r["population"], reverse=True), start=1):
        row["populationRank"] = i
    dense_rows = [row for row in records if row["populationRanked"] and row["density"] is not None]
    for i, row in enumerate(sorted(dense_rows, key=lambda r: r["density"], reverse=True), start=1):
        row["densityRank"] = i
    for row in records:
        row.setdefault("populationRank", None)
        row.setdefault("densityRank", None)

    records.sort(key=lambda row: row["nameKo"])
    payload = {
        "retrieved": "2026-10-11",
        "unMembers": 193,
        "studyCount": len(records),
        "populationYear": 2025,
        "countries": records,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
    print(f"wrote {OUT} countries={len(records)} bytes={OUT.stat().st_size}")
    no_tz = [r["iso2"] for r in records if not r["timezones"]]
    no_rel = [r["iso2"] for r in records if not r["religions"]]
    print("no tz", no_tz)
    print("no religion", no_rel)
    top_pop = sorted(ranked_rows, key=lambda r: r["population"], reverse=True)[:5]
    print("top pop", [(r["iso2"], r["population"], r["populationRank"]) for r in top_pop])
    top_area = sorted(records, key=area_key, reverse=True)[:5]
    print("top area", [(r["iso2"], r["areaKm2"]) for r in top_area])
    small = sorted(records, key=area_key)[:5]
    print("small area", [(r["iso2"], r["areaKm2"], r["status"]) for r in small])
    top_d = sorted(dense_rows, key=lambda r: r["density"], reverse=True)[:5]
    print("dense", [(r["iso2"], r["density"]) for r in top_d])
    low_d = sorted(dense_rows, key=lambda r: r["density"])[:5]
    print("sparse", [(r["iso2"], r["density"]) for r in low_d])


if __name__ == "__main__":
    main()
