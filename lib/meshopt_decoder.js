// This file is part of meshoptimizer library and is distributed under the terms of MIT License.
// Copyright (C) 2016-2020, by Arseny Kapoulkine (arseny.kapoulkine@gmail.com)
var MeshoptDecoder = (function() {
	"use strict";

	// Built with emcc (Emscripten gcc/clang-like replacement) 1.39.9 (commit 86a4766a617150f44158ee63977d6c24b305a4ac)
	var wasm_base = "0061736D0100000001230660037F7F7F0060017F0060017F017F60057F7F7F7F7F017F60000060037F7F7F017F02270103656E761F656D736372697074656E5F6E6F746966795F6D656D6F72795F67726F7774680001030B0A0504020001000003020305030100010608017F0141C0CC010B07880107066D656D6F727902001A6D6573686F70745F6465636F6465566572746578427566666572000A196D6573686F70745F6465636F6465496E6465784275666665720008176D6573686F70745F6465636F646546696C7465724F63740007186D6573686F70745F6465636F646546696C746572517561740006065F73746172740002047362726B00090ACD2D0A810401037F20024180044F0440200020012002100420000F0B200020026A210302402000200173410371450440024020024101480440200021020C010B2000410371450440200021020C010B200021020340200220012D00003A0000200141016A2101200241016A220220034F0D0120024103710D000B0B02402003417C71220441C000490D002002200441406A22054B0D0003402002200128020036020020022001280204360204200220012802083602082002200128020C36020C2002200128021036021020022001280214360214200220012802183602182002200128021C36021C2002200128022036022020022001280224360224200220012802283602282002200128022C36022C2002200128023036023020022001280234360234200220012802383602382002200128023C36023C200141406B2101200241406B220220054D0D000B0B200220044F0D01034020022001280200360200200141046A2101200241046A22022004490D000B0C010B20034104490440200021020C010B2003417C6A22042000490440200021020C010B200021020340200220012D00003A0000200220012D00013A0001200220012D00023A0002200220012D00033A0003200141046A2101200241046A220220044D0D000B0B200220034904400340200220012D00003A0000200141016A2101200241016A22022003470D000B0B20000B0300010B230020003F004110746B41FFFF036A4110764000417F46044041000F0B4100100041010B3B01017F20020440034020002001200241FC03200241FC03491B220310012100200141FC036A2101200041FC036A2100200220036B22020D000B0B0BC60201027F20004180016A2201417F6A41FF013A0000200041FF013A00002001417E6A41FF013A0000200041FF013A00012001417D6A41FF013A0000200041FF013A00022001417C6A41FF013A0000200041FF013A00032000410020006B41037122016A2200417F360200200041800120016B417C7122026A2201417C6A417F360200024020024109490D002000417F3602082000417F360204200141786A417F360200200141746A417F36020020024119490D002000417F3602182000417F3602142000417F3602102000417F36020C200141706A417F3602002001416C6A417F360200200141686A417F360200200141646A417F3602002002200041047141187222026B22014120490D00200020026A210003402000427F3703182000427F3703102000427F3703082000427F370300200041206A2100200141606A2201411F4B0D000B0B0BBD0302057F047D200104400340027F43F304353F2000200441037422024106726A2E01002203410372B2952209200020026A2E0100B29422084300FEFF4694430000003F43000000BF20084300000000601B92220A8B430000004F5D0440200AA80C010B4180808080780B2106200020024104726A2E01002107200020024102726A2E01002102200020044102742205200341037141047422034180086A2802006A4101746A20063B0100200020034184086A28020020056A4101746A027F20092002B294220A4300FEFF4694430000003F43000000BF200A4300000000601B92220B8B430000004F5D0440200BA80C010B4180808080780B3B0100200020034188086A28020020056A4101746A027F20092007B29422094300FEFF4694430000003F43000000BF20094300000000601B92220B8B430000004F5D0440200BA80C010B4180808080780B3B010020002003418C086A28020020056A4101746A027F430000803F200820089493200A200A94932009200994932208430000000020084300000000601B914300FEFF4694430000003F9222088B430000004F5D04402008A80C010B4180808080780B3B0100200441016A22042001470D000B0B0B8D0502067F057D0240200241044604402001450D01410021020340027F430000003F43000000BF43000000002000200241027422034102726A22042C0000B2200020036A22052C00002206B222098B93200020034101726A22072C00002203B2220C8B93220A200A43000000006022081B220B200B8C220D2006417F4A1B20099222094300000000601B2009430000FE42200A200A942009200994200B200D2003417F4A1B200C92220920099492929195220B9492220C8B430000004F5D0440200CA80C010B4180808080780B2103200520033A00002007027F430000003F43000000BF20094300000000601B2009200B949222098B430000004F5D04402009A80C010B4180808080780B3A00002004027F430000003F43000000BF20081B200A200B9492220A8B430000004F5D0440200AA80C010B4180808080780B3A0000200241016A22022001470D000B0C010B2001450D00410021020340027F430000003F43000000BF43000000002000200241037422034104726A22042E0100B2200020036A22052E01002206B222098B93200020034102726A22072E01002203B2220C8B93220A200A43000000006022081B220B200B8C220D2006417F4A1B20099222094300000000601B20094300FEFF46200A200A942009200994200B200D2003417F4A1B200C92220920099492929195220B9492220C8B430000004F5D0440200CA80C010B4180808080780B2103200520033B01002007027F430000003F43000000BF20094300000000601B2009200B949222098B430000004F5D04402009A80C010B4180808080780B3B01002004027F430000003F43000000BF20081B200A200B9492220A8B430000004F5D0440200AA80C010B4180808080780B3B0100200241016A22022001470D000B0B0BBE10010F7F230041C0016B22072400417E210A0240200141036E220841116A20044B0D00417F210A20032D0000220541F0017141E001470D002005410F71220541014B0D00200741406B10052007427F3703382007427F3703302007427F3703282007427F3703202007427F3703182007427F3703102007427F3703082007427F370300200320046A41706A2111200341016A221220086A210920010440410D410F20054101461B2113410021044100210A0340200920114B0440417E210A0C030B027F20122D0000220541EF014D0440200741406B2005410476417F73200A6A410F714103746A2203280204210B2003280200210C2005410F712203201349044020072005417F7320046A410F714102746A280200200F20031B21062003452108024020024102460440200020104101746A2203200C3B01002003200B3B0102200320063B01040C010B200020104102746A2203200C360200200320063602082003200B3602040B2008200F6A210F200741406B200A4103746A2203200B36020420032006360200200720044102746A2006360200200741406B200A41016A410F7122054103746A2203200C36020020032006360204200541016A210A200420086A0C020B2003410F47047F2003200E6A20034103736B0520092C0000220541FF01712103027F200941016A2005417F4A0D001A200341FF007120092C0001220541FF0071410774722103200941026A2005417F4A0D001A20092C0002220541FF0071410E742003722103200941036A2005417F4A0D001A20092C0003220541FF00714115742003722103200941046A2005417F4A0D001A20092D0004411C742003722103200941056A0B2109410020034101716B200341017673200E6A0B210E024020024102460440200020104101746A2203200C3B01002003200B3B01022003200E3B01040C010B200020104102746A2203200C3602002003200E3602082003200B3602040B200741406B200A4103746A2203200B3602042003200E360200200720044102746A200E360200200741406B200A41016A410F7122054103746A2203200C3602002003200E360204200541016A210A200441016A0C010B200541FD014D04402007200420112005410F716A2D0000220641047622056B410F714102746A280200200F41016A220320051B210B2007200420066B410F714102746A280200200320054522056A22082006410F7122031B210C2003452106024020024102460440200020104101746A2203200F3B01002003200B3B01022003200C3B01040C010B200020104102746A2203200F3602002003200C3602082003200B3602040B200720044102746A200F360200200741406B200A4103746A2203200F3602042003200B3602002007200441016A2204410F714102746A200B360200200741406B200A41016A410F714103746A2203200C3602002003200B3602042007200420056A410F7122054102746A200C360200200741406B200A41026A410F7122044103746A2203200F3602002003200C360204200441016A210A200620086A210F200520066A0C010B200F410020092D000022061B220D200541FE014622056A21032006410F71210B02402006410476220C450440200341016A21080C010B2003210820072004200C6B410F714102746A28020021030B0240200B450440200841016A210F0C010B2008210F2007200420066B410F714102746A28020021080B024020050440200941016A21060C010B20092C0001220541FF0171210D027F200941026A2005417F4A0D001A200D41FF007120092C0002220541FF007141077472210D200941036A2005417F4A0D001A20092C0003220541FF0071410E74200D72210D200941046A2005417F4A0D001A20092C0004220541FF0071411574200D72210D200941056A2005417F4A0D001A20092D0005411C74200D72210D200941066A0B21064100200D4101716B200D41017673200E6A220E210D0B0240200C410F470440200621050C010B20062C0000220541FF01712103027F200641016A2005417F4A0D001A200341FF007120062C0001220541FF0071410774722103200641026A2005417F4A0D001A20062C0002220541FF0071410E742003722103200641036A2005417F4A0D001A20062C0003220541FF00714115742003722103200641046A2005417F4A0D001A20062D0004411C742003722103200641056A0B2105410020034101716B200341017673200E6A220E21030B0240200B410F470440200521090C010B20052C0000220641FF01712108027F200541016A2006417F4A0D001A200841FF007120052C0001220641FF0071410774722108200541026A2006417F4A0D001A20052C0002220641FF0071410E742008722108200541036A2006417F4A0D001A20052C0003220641FF00714115742008722108200541046A2006417F4A0D001A20052D0004411C742008722108200541056A0B2109410020084101716B200841017673200E6A220E21080B024020024102460440200020104101746A2205200D3B0100200520033B0102200520083B01040C010B200020104102746A2205200D36020020052008360208200520033602040B200741406B200A4103746A2205200D36020420052003360200200720044102746A200D360200200741406B200A41016A410F714103746A22052008360200200520033602042007200441016A2204410F714102746A2003360200200741406B200A41026A410F714103746A2203200D3602002003200836020420072004200C45200C410F46726A2203410F714102746A2008360200200A41036A210A2003200B45200B410F46726A0B2104201241016A2112200A410F71210A2004410F712104201041036A22102001490D000B0B4100417D20092011461B210A0B200741C0016A2400200A0B4101027F3F002101024041C00C2802002202200041036A417C716A220020014110744D0D00200010030D0041C0084130360200417F0F0B41C00C200036020020020BCB0C010F7F23004180C4006B22102400027F417E200241016A20044B0D001A417F20032D000041A001470D001A2010200320046A220F20026B20021001210B4180C00020026E41F0FF007122044180022004418002491B2111200341016A210902400340200C20014F0D0120112001200C6B200C20116A2001491B210D024002402002450440200921040C010B200D410F6A22034170712112200341047641036A41027621134100210E2009210A0340200F200A6B2013490440410021090C030B200A20136A21044100210941002103201204400340200F20046B4120490D04200B4180C2006A20036A210802400240024002400240200A20034106766A2D000020034103764106717641037141016B0E03010203000B20084200370300200842003703080C030B200820042D000420042D000022064106762205200541034622051B3A00002008200441046A20056A22052D000020064104764103712207200741034622071B3A00012008200520076A22052D000020064102764103712207200741034622071B3A00022008200520076A22052D000020064103712206200641034622061B3A00032008200520066A22052D000020042D000122064106762207200741034622071B3A00042008200520076A22052D000020064104764103712207200741034622071B3A00052008200520076A22052D000020064102764103712207200741034622071B3A00062008200520076A22052D000020064103712206200641034622061B3A00072008200520066A22052D000020042D000222064106762207200741034622071B3A00082008200520076A22052D000020064104764103712207200741034622071B3A00092008200520076A22052D000020064102764103712207200741034622071B3A000A2008200520076A22052D000020064103712206200641034622061B3A000B2008200520066A22062D000020042D000322044106762205200541034622051B3A000C2008200520066A22062D000020044104764103712205200541034622051B3A000D2008200520066A22062D000020044102764103712205200541034622051B3A000E2008200520066A22082D000020044103712204200441034622041B3A000F200420086A21040C020B200820042D000820042D0000220641047622052005410F4622051B3A00002008200441086A20056A22052D00002006410F7122062006410F4622061B3A00012008200520066A22062D000020042D0001220541047622072007410F4622071B3A00022008200620076A22062D00002005410F7122052005410F4622051B3A00032008200520066A22062D000020042D0002220541047622072007410F4622071B3A00042008200620076A22062D00002005410F7122052005410F4622051B3A00052008200520066A22062D000020042D0003220541047622072007410F4622071B3A00062008200620076A22062D00002005410F7122052005410F4622051B3A00072008200520066A22062D000020042D0004220541047622072007410F4622071B3A00082008200620076A22062D00002005410F7122052005410F4622051B3A00092008200520066A22062D000020042D0005220541047622072007410F4622071B3A000A2008200620076A22062D00002005410F7122052005410F4622051B3A000B2008200520066A22062D000020042D0006220541047622072007410F4622071B3A000C2008200620076A22062D00002005410F7122052005410F4622051B3A000D2008200520066A22062D000020042D0007220441047622052005410F4622051B3A000E2008200520066A22082D00002004410F7122042004410F4622041B3A000F200420086A21040C010B2008200429000037000020082004290008370008200441106A21040B200341106A22032012490D000B0B2004450D02200D0440200B200E6A2D0000210A200E21030340200B4180026A20036A200A200B4180C2006A20096A2D0000220A4101764100200A4101716B736A220A3A0000200220036A2103200941016A2209200D470D000B0B2004210A200E41016A220E2002470D000B0B20002002200C6C6A200B4180026A2002200D6C10011A200B200B4180026A200D417F6A20026C6A200210011A200421090B200D410020091B200C6A210C20090D000B417E0C010B4100417D200F20096B20024120200241204B1B461B0B210920104180C4006A240020090B0B4C02004180080B3D010000000200000003000000000000000200000003000000000000000100000003000000000000000100000002000000000000000100000002000000030041C00C0B02E066";
	var wasm_simd = "0061736D0100000001260660000060037F7F7F0060017F017F60057F7F7F7F7F017F60017F0060067F7F7F7F7F7F017F02270103656E761F656D736372697074656E5F6E6F746966795F6D656D6F72795F67726F7774680004030A0900020201010305030005030100010608017F014180DE010B07880107066D656D6F727902001A6D6573686F70745F6465636F64655665727465784275666665720008196D6573686F70745F6465636F6465496E6465784275666665720006176D6573686F70745F6465636F646546696C7465724F63740005186D6573686F70745F6465636F646546696C746572517561740004065F73746172740001047362726B00020C01010AD83F09040010090B4101027F3F002101024041801E2802002202200041036A417C716A220020014110744D0D00200010030D0041801A4130360200417F0F0B41801E200036020020020B230020003F004110746B41FFFF036A4110764000417F46044041000F0B4100100041010BAA0302027F077B2001044003402000200341037422046A2202430000803FFD1243F304353FFD122002FD0000002205200020044110726AFD0000002207FD03040506070C0D0E0F141516171C1D1E1F22084110FD77220A4103FD0CFD4EFDAF01FD9D01220620052007FD030001020308090A0B1011121318191A1B22054110FD764110FD77FDAF01FD9C0122072007FD9C01200620054110FD77FDAF01FD9C0122092009FD9C01200620084110FD764110FD77FDAF01FD9C0122082008FD9C01FD9A01FD9A01FD9B014100FD0CFD8201FD97014300FEFF46FD122206FD9C01430000404BFD122205FD9A0141FFFF03FD0C220BFD4D20092006FD9C012005FD9A014110FD76FD4E220920082006FD9C012005FD9A014110FD7620072006FD9C012005FD9A01200BFD4DFD4E2205FD03080918190A0B1A1B0C0D1C1D0E0F1E1F2207FD1001200A4104FD762206FD0D03AD8937031820022007FD10002006FD0D02AD89370310200220092005FD03000110110203121304051415060716172205FD10012006FD0D01AD8937030820022005FD10002006FD0D00AD89370300200341046A22032001490D000B0B0BD50502037F077B230041106B21030240200241044604402001450D01410021020340200020024102746A22032003FD000000220A4118FD764118FD77FDAF012207200A4108FD764118FD77FDAF012007FD9501200A4110FD764118FD77FDAF012208FD9501FD9A01FD9B0122064100FD0CFD800122092007418080808078FD0C220BFD4DFD4FFD9A012207430000FE42FD1220072007FD9C0120062006FD9C01200820092008200BFD4DFD4FFD9A0122072007FD9C01FD9A01FD9A01FD9701FD9D012208FD9C01430000404BFD122209FD9A0141FF01FD0CFD4D200A4180808078FD0CFD4DFD4E20072008FD9C012009FD9A014108FD764180FE03FD0CFD4DFD4E20062008FD9C012009FD9A014110FD76418080FC07FD0CFD4DFD4EFD010000200241046A22022001490D000B0C010B200341FFFF01FD0CFD0104002001450D004100210203402000200241037422044110726A2205FD000000210A200020046A22042004FD00000022064100FD0C22094180807CFD0E014180807CFD0E03220BFD4D2003FD0004002006200AFD03040506070C0D0E0F141516171C1D1E1FFD4DFDAF012006200AFD030001020308090A0B1011121318191A1B22064110FD77FDAF012207FD950120064110FD764110FD77FDAF012208FD9501FD9A01FD9B0122064300FEFF46FD12200820062009FD800122092008418080808078FD0C220CFD4DFD4FFD9A0122082008FD9C0120062006FD9C01200720092007200CFD4DFD4FFD9A0122062006FD9C01FD9A01FD9A01FD9701FD9D012207FD9C01430000404BFD122209FD9A014110FD7620082007FD9C012009FD9A0141FFFF03FD0CFD4DFD4E220820062007FD9C012009FD9A01417FFD084100FD0B014100FD0B034100FD0B054100FD0B07FD4D2206FD0300011011020312130405141506071617FD4EFD0100002005200A200BFD4D20082006FD03080918190A0B1A1B0C0D1C1D0E0F1E1FFD4EFD010000200241046A22022001490D000B0B0BC510010F7F230041C0016B22072400417E210A0240200141036E220841116A20044B0D00417F210A20032D0000220541F0017141E001470D002005410F71220541014B0D00200741406B41FF01418001FC0B002007427F3703382007427F3703302007427F3703282007427F3703202007427F3703182007427F3703102007427F3703082007427F370300200320046A41706A2111200341016A221220086A210920010440410D410F20054101461B2113410021044100210A0340200920114B0440417E210A0C030B027F20122D0000220541EF014D0440200741406B2005410476417F73200A6A410F714103746A2203280204210B2003280200210C2005410F712203201349044020072005417F7320046A410F714102746A280200200F20031B21062003452108024020024102460440200020104101746A2203200C3B01002003200B3B0102200320063B01040C010B200020104102746A2203200C360200200320063602082003200B3602040B2008200F6A210F200741406B200A4103746A2203200B36020420032006360200200720044102746A2006360200200741406B200A41016A410F7122054103746A2203200C36020020032006360204200541016A210A200420086A0C020B2003410F47047F2003200E6A20034103736B0520092C0000220541FF01712103027F200941016A2005417F4A0D001A200341FF007120092C0001220541FF0071410774722103200941026A2005417F4A0D001A20092C0002220541FF0071410E742003722103200941036A2005417F4A0D001A20092C0003220541FF00714115742003722103200941046A2005417F4A0D001A20092D0004411C742003722103200941056A0B2109410020034101716B200341017673200E6A0B210E024020024102460440200020104101746A2203200C3B01002003200B3B01022003200E3B01040C010B200020104102746A2203200C3602002003200E3602082003200B3602040B200741406B200A4103746A2203200B3602042003200E360200200720044102746A200E360200200741406B200A41016A410F7122054103746A2203200C3602002003200E360204200541016A210A200441016A0C010B200541FD014D04402007200420112005410F716A2D0000220641047622056B410F714102746A280200200F41016A220320051B210B2007200420066B410F714102746A280200200320054522056A22082006410F7122031B210C2003452106024020024102460440200020104101746A2203200F3B01002003200B3B01022003200C3B01040C010B200020104102746A2203200F3602002003200C3602082003200B3602040B200720044102746A200F360200200741406B200A4103746A2203200F3602042003200B3602002007200441016A2204410F714102746A200B360200200741406B200A41016A410F714103746A2203200C3602002003200B3602042007200420056A410F7122054102746A200C360200200741406B200A41026A410F7122044103746A2203200F3602002003200C360204200441016A210A200620086A210F200520066A0C010B200F410020092D000022061B220D200541FE014622056A21032006410F71210B02402006410476220C450440200341016A21080C010B2003210820072004200C6B410F714102746A28020021030B0240200B450440200841016A210F0C010B2008210F2007200420066B410F714102746A28020021080B024020050440200941016A21060C010B20092C0001220541FF0171210D027F200941026A2005417F4A0D001A200D41FF007120092C0002220541FF007141077472210D200941036A2005417F4A0D001A20092C0003220541FF0071410E74200D72210D200941046A2005417F4A0D001A20092C0004220541FF0071411574200D72210D200941056A2005417F4A0D001A20092D0005411C74200D72210D200941066A0B21064100200D4101716B200D41017673200E6A220E210D0B0240200C410F470440200621050C010B20062C0000220541FF01712103027F200641016A2005417F4A0D001A200341FF007120062C0001220541FF0071410774722103200641026A2005417F4A0D001A20062C0002220541FF0071410E742003722103200641036A2005417F4A0D001A20062C0003220541FF00714115742003722103200641046A2005417F4A0D001A20062D0004411C742003722103200641056A0B2105410020034101716B200341017673200E6A220E21030B0240200B410F470440200521090C010B20052C0000220641FF01712108027F200541016A2006417F4A0D001A200841FF007120052C0001220641FF0071410774722108200541026A2006417F4A0D001A20052C0002220641FF0071410E742008722108200541036A2006417F4A0D001A20052C0003220641FF00714115742008722108200541046A2006417F4A0D001A20052D0004411C742008722108200541056A0B2109410020084101716B200841017673200E6A220E21080B024020024102460440200020104101746A2205200D3B0100200520033B0102200520083B01040C010B200020104102746A2205200D36020020052008360208200520033602040B200741406B200A4103746A2205200D36020420052003360200200720044102746A200D360200200741406B200A41016A410F714103746A22052008360200200520033602042007200441016A2204410F714102746A2003360200200741406B200A41026A410F714103746A2203200D3602002003200836020420072004200C45200C410F46726A2203410F714102746A2008360200200A41036A210A2003200B45200B410F46726A0B2104201241016A2112200A410F71210A2004410F712104201041036A22102001490D000B0B4100417D20092011461B210A0B200741C0016A2400200A0BE822030D7F017E087B23004180C8006B220B24000240200404402003410F6A2206417071220A41036C2111200A4101742112200641047641036A410276210F03402000210C4100210E024003402001200C6B200F490440410021000C050B200B4180406B200A200E6C6A2110200C200F6A210041C0002108410021060240200A41C000490D0041002107200120006B41FF004D0D00034020082106200720106A210802400240024002400240200C20074106766A2D0000220741037141016B0E03010203000B20084100FD0CFD0104000C030B20082000FD0000042000FD00000022144104FD662014FD030010011102120313041405150616071722144102FD672014FD03001001110212031304140515061607174183868C18FD0CFD4D22144103FD04FD1822162014FD030001020308090A0B040506070C0D0E0F2215FD100042818490C090C0808208832015FD10014290C08082888288A0807F8384221342108820138422134208882013842213A741FF017122094103744180086AFD00030020094180186AFD00000022152014FD03000000000000000000000000000000002013422088A741FF017122094103744180086AFD000300FD57FD0300010203040506071011121314151617FDC00120142016FD50FD01040020094180186A2D0000200041046A2015FD06006A6A21000C020B20082000FD0000082000FD00000022144104FD672014FD0300100111021203130414051506160717418F9EBCF800FD0CFD4D2214410FFD04FD1822162014FD030001020308090A0B040506070C0D0E0F2215FD100042818490C090C0808208832015FD10014290C08082888288A0807F8384221342108820138422134208882013842213A741FF017122094103744180086AFD00030020094180186AFD00000022152014FD03000000000000000000000000000000002013422088A741FF017122094103744180086AFD000300FD57FD0300010203040506071011121314151617FDC00120142016FD50FD01040020094180186A2D0000200041086A2015FD06006A6A21000C010B20082000FD000000FD010400200041106A21000B02400240024002400240200741027641037141016B0E03010203000B20084100FD0CFD0104100C030B20082000FD0000042000FD00000022144104FD662014FD030010011102120313041405150616071722144102FD672014FD03001001110212031304140515061607174183868C18FD0CFD4D22144103FD04FD1822162014FD030001020308090A0B040506070C0D0E0F2215FD100042818490C090C0808208832015FD10014290C08082888288A0807F8384221342108820138422134208882013842213A741FF017122094103744180086AFD00030020094180186AFD00000022152014FD03000000000000000000000000000000002013422088A741FF017122094103744180086AFD000300FD57FD0300010203040506071011121314151617FDC00120142016FD50FD01041020094180186A2D0000200041046A2015FD06006A6A21000C020B20082000FD0000082000FD00000022144104FD672014FD0300100111021203130414051506160717418F9EBCF800FD0CFD4D2214410FFD04FD1822162014FD030001020308090A0B040506070C0D0E0F2215FD100042818490C090C0808208832015FD10014290C08082888288A0807F8384221342108820138422134208882013842213A741FF017122094103744180086AFD00030020094180186AFD00000022152014FD03000000000000000000000000000000002013422088A741FF017122094103744180086AFD000300FD57FD0300010203040506071011121314151617FDC00120142016FD50FD01041020094180186A2D0000200041086A2015FD06006A6A21000C010B20082000FD000000FD010410200041106A21000B024002400240024002400240024002400240200741047641037141016B0E03010203000B20084100FD0CFD010420200741067641016B0E03040506030B20082000FD0000042000FD00000022144104FD662014FD030010011102120313041405150616071722144102FD672014FD03001001110212031304140515061607174183868C18FD0CFD4D22144103FD04FD1822162014FD030001020308090A0B040506070C0D0E0F2215FD100042818490C090C0808208832015FD10014290C08082888288A0807F8384221342108820138422134208882013842213A741FF017122094103744180086AFD00030020094180186AFD00000022152014FD03000000000000000000000000000000002013422088A741FF017122094103744180086AFD000300FD57FD0300010203040506071011121314151617FDC00120142016FD50FD01042020094180186A2D0000200041046A2015FD06006A6A2100200741067641016B0E03030405020B20082000FD0000082000FD00000022144104FD672014FD0300100111021203130414051506160717418F9EBCF800FD0CFD4D2214410FFD04FD1822162014FD030001020308090A0B040506070C0D0E0F2215FD100042818490C090C0808208832015FD10014290C08082888288A0807F8384221342108820138422134208882013842213A741FF017122094103744180086AFD00030020094180186AFD00000022152014FD03000000000000000000000000000000002013422088A741FF017122094103744180086AFD000300FD57FD0300010203040506071011121314151617FDC00120142016FD50FD01042020094180186A2D0000200041086A2015FD06006A6A2100200741067641016B0E03020304010B20082000FD000000FD010420200041106A2100200741067641016B0E03010203000B20084100FD0CFD0104300C030B20082000FD0000042000FD00000022144104FD662014FD030010011102120313041405150616071722144102FD672014FD03001001110212031304140515061607174183868C18FD0CFD4D22144103FD04FD1822162014FD030001020308090A0B040506070C0D0E0F2215FD100042818490C090C0808208832015FD10014290C08082888288A0807F8384221342108820138422134208882013842213A741FF017122074103744180086AFD00030020074180186AFD00000022152014FD03000000000000000000000000000000002013422088A741FF017122074103744180086AFD000300FD57FD0300010203040506071011121314151617FDC00120142016FD50FD01043020074180186A2D0000200041046A2015FD06006A6A21000C020B20082000FD0000082000FD00000022144104FD672014FD0300100111021203130414051506160717418F9EBCF800FD0CFD4D2214410FFD04FD1822162014FD030001020308090A0B040506070C0D0E0F2215FD100042818490C090C0808208832015FD10014290C08082888288A0807F8384221342108820138422134208882013842213A741FF017122074103744180086AFD00030020074180186AFD00000022152014FD03000000000000000000000000000000002013422088A741FF017122074103744180086AFD000300FD57FD0300010203040506071011121314151617FDC00120142016FD50FD01043020074180186A2D0000200041086A2015FD06006A6A21000C010B20082000FD000000FD010430200041106A21000B200641406B2208200A4B0D0120062107200120006B41FF004B0D000B0B2006200A4904400340200120006B4120490440410021000C070B200620106A210702400240024002400240200C20064106766A2D000020064103764106717641037141016B0E03010203000B20074100FD0CFD0104000C030B20072000FD0000042000FD00000022144104FD662014FD030010011102120313041405150616071722144102FD672014FD03001001110212031304140515061607174183868C18FD0CFD4D22144103FD04FD1822162014FD030001020308090A0B040506070C0D0E0F2215FD100042818490C090C0808208832015FD10014290C08082888288A0807F8384221342108820138422134208882013842213A741FF017122074103744180086AFD00030020074180186AFD00000022152014FD03000000000000000000000000000000002013422088A741FF017122074103744180086AFD000300FD57FD0300010203040506071011121314151617FDC00120142016FD50FD01040020074180186A2D0000200041046A2015FD06006A6A21000C020B20072000FD0000082000FD00000022144104FD672014FD0300100111021203130414051506160717418F9EBCF800FD0CFD4D2214410FFD04FD1822162014FD030001020308090A0B040506070C0D0E0F2215FD100042818490C090C0808208832015FD10014290C08082888288A0807F8384221342108820138422134208882013842213A741FF017122074103744180086AFD00030020074180186AFD00000022152014FD03000000000000000000000000000000002013422088A741FF017122074103744180086AFD000300FD57FD0300010203040506071011121314151617FDC00120142016FD50FD01040020074180186A2D0000200041086A2015FD06006A6A21000C010B20072000FD000000FD010400200041106A21000B200641106A2206200A490D000B0B200004402000210C200E41016A220E4104460D020C010B0B410021000C030B200A04402005200D6AFD0000002114200B200D6A210841002107034020082014200B4180406B20076A2206FD00040022164101FD6741FF00FD042214FD4D20164101FD042216FD4DFD51FD4F22152006200A6AFD00040022174101FD672014FD4D20172016FD4DFD51FD4F2217FD03001001110212031304140515061607172218200620126AFD000400221A4101FD672014FD4D201A2016FD4DFD51FD4F221A200620116AFD000400221B4101FD672014FD4D201B2016FD4DFD51FD4F2216FD0300100111021203130414051506160717221BFD030001101102031213040514150607161722142014FD0300010203000102030001020300010203FD572219FD0D00360200200420086A2206201920142014FD0304050607040506070405060704050607FD572219FD0D00360200200420066A2206201920142014FD0308090A0B08090A0B08090A0B08090A0BFD572219FD0D00360200200420066A2206201920142014FD030C0D0E0F0C0D0E0F0C0D0E0F0C0D0E0FFD572214FD0D00360200200420066A220620142018201BFD03080918190A0B1A1B0C0D1C1D0E0F1E1F22142014FD0300010203000102030001020300010203FD572218FD0D00360200200420066A2206201820142014FD0304050607040506070405060704050607FD572218FD0D00360200200420066A2206201820142014FD0308090A0B08090A0B08090A0B08090A0BFD572218FD0D00360200200420066A2206201820142014FD030C0D0E0F0C0D0E0F0C0D0E0F0C0D0E0FFD572214FD0D00360200200420066A2206201420152017FD03081809190A1A0B1B0C1C0D1D0E1E0F1F2215201A2016FD03081809190A1A0B1B0C1C0D1D0E1E0F1F2216FD030001101102031213040514150607161722142014FD0300010203000102030001020300010203FD572217FD0D00360200200420066A2206201720142014FD0304050607040506070405060704050607FD572217FD0D00360200200420066A2206201720142014FD0308090A0B08090A0B08090A0B08090A0BFD572217FD0D00360200200420066A2206201720142014FD030C0D0E0F0C0D0E0F0C0D0E0F0C0D0E0FFD572214FD0D00360200200420066A2206201420152016FD03080918190A0B1A1B0C0D1C1D0E0F1E1F22142014FD0300010203000102030001020300010203FD572216FD0D00360200200420066A2206201620142014FD0304050607040506070405060704050607FD572216FD0D00360200200420066A2206201620142014FD0308090A0B08090A0B08090A0B08090A0BFD572216FD0D00360200200420066A2206201620142014FD030C0D0E0F0C0D0E0F0C0D0E0F0C0D0E0FFD572214FD0D00360200200420066A2108200741106A2207200A490D000B0B200D41046A220D2004490D000B0B2002200B200320046CFC0A00002005200B2003417F6A20046C6A2004FC0A00000B200B4180C8006A240020000BC50101047F23004180026B22062400027F417E200241016A20044B0D001A417F20032D000041A001470D001A2006200320046A220720026B2002FC0A00004180C00020026E41F0FF007122044180022004418002491B2108200341016A210402400340200520014F0D012008200120056B200520086A2001491B22034100200420072000200220056C6A200320022006100722041B20056A210520040D000B417E0C010B4100417D200720046B20024120200241204B1B461B0B210520064180026A240020050B7001057F230041106B2103034041002101410021020340200341086A20016A200241807F200020017641017122041B3A0000200220046A2102200141016A22014108470D000B20004103744180086A200329030837030020004180186A20023A0000200041016A2200418002470D000B0B0B09010041801E0B02A06F";

	// Uses bulk-memory and simd extensions
	var detector = new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,4,26,11]);

	var wasm = wasm_base;

	if (WebAssembly.validate(detector)) {
		wasm = wasm_simd;
		console.log("Warning: meshopt_decoder is using experimental SIMD support");
	}

	var instance, heap;

	var env = {
		emscripten_notify_memory_growth: function(index) {
			heap = new Uint8Array(instance.exports.memory.buffer);
		}
	};

	var promise =
		WebAssembly.instantiate(unhex(wasm), { env })
		.then(function(result) {
			instance = result.instance;
			instance.exports._start();
			env.emscripten_notify_memory_growth(0);
		});

	function unhex(data) {
		var bytes = new Uint8Array(data.length / 2);
		for (var i = 0; i < data.length; i += 2) {
			bytes[i / 2] = parseInt(data.substr(i, 2), 16);
		}
		return bytes.buffer;
	}

	function decode(fun, target, count, size, source, filter) {
		var sbrk = instance.exports.sbrk;
		var count4 = (count + 3) & ~3; // pad for SIMD filter
		var tp = sbrk(count4 * size);
		var sp = sbrk(source.length);
		heap.set(source, sp);
		var res = fun(tp, count, size, sp, source.length);
		if (res == 0 && filter) {
			filter(tp, count4, size);
		}
		target.set(heap.subarray(tp, tp + count * size));
		sbrk(tp - sbrk(0));
		if (res != 0) {
			throw new Error("Malformed buffer data: " + res);
		}
	};

	function filterFun(filter) {
		switch (filter) {
		case 0:
		case undefined:
			return undefined;

		case 1:
			return instance.exports.meshopt_decodeFilterOct;

		case 2:
			return instance.exports.meshopt_decodeFilterQuat;

		default:
			throw new Error("Unknown filter: " + filter);
		}
	}

	return {
		ready: promise,
		decodeVertexBuffer: function(target, count, size, source, filter) {
			decode(instance.exports.meshopt_decodeVertexBuffer, target, count, size, source, filterFun(filter));
		},
		decodeIndexBuffer: function(target, count, size, source) {
			decode(instance.exports.meshopt_decodeIndexBuffer, target, count, size, source);
		},
		decodeGltfBuffer: function(target, count, size, source, mode, filter) {
			switch (mode) {
			case 0:
				decode(instance.exports.meshopt_decodeVertexBuffer, target, count, size, source, filterFun(filter));
				break;

			case 1:
				decode(instance.exports.meshopt_decodeIndexBuffer, target, count, size, source);
				break;

			default:
				throw new Error("Unknown mode: " + mode);
			}
		}
	};
})();

// if (typeof exports === 'object' && typeof module === 'object')
// 	module.exports = MeshoptDecoder;
// else if (typeof define === 'function' && define['amd'])
// 	define([], function() {
// 		return MeshoptDecoder;
// 	});
// else if (typeof exports === 'object')
// 	exports["MeshoptDecoder"] = MeshoptDecoder;

export { MeshoptDecoder }