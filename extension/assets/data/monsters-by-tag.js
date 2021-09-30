"use strict";

var MonstersByTag = (function() { 

var data = 
{"2019 BMW i8":[8],"2021 Chevloret camaro":[8],"60fps":[684],"ABC":[92,385],"abduction":[244],"abstract":[466,469,470,472],"abstract art":[207],"ac/dc":[363],"academia":[469,470,472],"academic":[469,470,472],"acceptable ads":[91],"accessories":[563],"accessory":[110,637],"account":[607],"ace":[271],"acer":[630],"acoustic":[243,350],"acoustics":[243],"acting":[209],"action":[325],"actor":[177],"actors":[177],"actress":[177],"actresses":[177],"ad":[91],"adafruit":[614],"admiral":[91],"adobe":[205],"adobe suite":[205],"ads":[91],"adventure":[325,335],"advertisement":[91],"advertisements":[91],"advice":[100],"agriculture":[96,102],"ai":[596],"AI":[638],"air traffic control":[118],"air travel":[118],"airline":[655],"airplane":[118,655],"airpods":[376],"alabama":[350],"albert king":[360],"alcohol":[179,211],"alexa":[625],"alien":[244,244],"aliens":[327],"alternative":[343],"alveoli":[300],"AM":[370],"amazon":[625],"ampitheater":[184],"ampitheatre":[184],"amusement park":[151],"android":[420,683],"andy warhol":[207],"animated film":[329],"animation":[329],"anime":[329],"antidepressants":[301],"antivirus":[618],"apartment":[87],"app":[618,683],"appeal":[100],"apple":[630],"aquarium":[178],"aquarius":[456],"archive":[48],"aries":[456],"art":[155,205,254],"artist":[155,254],"artists":[155,254],"arts":[254],"astrology":[456],"astronomy":[472,472],"astrophysics":[472],"asus":[630],"atm":[63,82,82],"atms":[63],"attorney":[100],"audio":[348],"aviation":[118],"babe ruth":[545],"baby":[169],"baby shark":[344],"back country":[350],"backhoe":[121],"backpack":[135],"backpacks":[135],"bag":[135,563,653],"baggage":[653],"bags":[135,154],"bake":[217],"baking":[217],"ballgame":[176],"balloons":[161],"bank":[63,82,410],"banking":[63,82,410],"bankinggo":[63],"banks":[63,82,410],"barbecue":[215],"bars":[179],"baseball":[370,545],"basketball":[370],"bat":[545],"batter":[545],"BB KING":[360],"bbq":[215],"beaches":[673],"beauty guru":[106],"bedtime":[310],"beer":[179],"bet":[181],"bibliographies":[48],"bibliography":[48],"bibtex":[48],"bicycle":[492],"bicycles":[492],"bike":[492],"bikes":[492],"biking":[492],"billboard":[91],"billy joel":[363],"biopark":[178],"biosphere":[178],"birth":[169],"birthday":[170,217],"birthday ideas":[161],"birthdays":[217],"black hole":[472],"blade":[594],"blades":[594],"blender":[221],"blocks":[92],"blowers":[161],"blue grass":[350],"blues":[360],"boardwalk":[151],"bob dylan":[360],"bob marley":[359],"Boogie-woogie":[360],"book":[48,111],"books":[48],"boston dynamics":[638],"bottle":[218],"bouquet":[274],"bouquets":[274],"bout":[176],"brad paisley":[350],"breadboard":[614],"breathing":[300],"breezy":[282],"bride":[165],"briefcase":[89],"briefcases":[89],"buggy":[477],"building":[121],"bulldozer":[121],"burial":[171],"business":[63,450],"business attire":[582],"button":[618],"buy":[477],"buying":[477],"cage":[178],"cake":[170,217],"cakes":[217],"call to action":[91],"calypso":[359],"cam":[633],"camaro":[8],"camcorder":[633],"camera":[281,324,633],"cameras":[281],"camp":[677],"campaign":[174],"campbell soup":[207],"camping":[677],"can":[86,275],"cancer":[456],"candidate":[386],"candy crush":[683],"canine":[425],"canned laughter":[330],"canoe":[499],"canvas":[589],"cap":[172],"capricorn":[456],"capsule":[301,310,315],"capsules":[301,310,315],"car":[6,8],"card":[271],"cards":[271],"career":[89],"careers":[89],"carnival":[151],"carribean":[359],"carrot":[229],"carrots":[229],"carryout":[210],"cars":[6,6,8],"cart":[477],"cartoons":[329],"casino":[181],"casket":[171],"catcher":[545],"CBS":[385],"ceiling":[282],"ceiling fan":[282],"ceiling fans":[282],"ceilings":[282],"celebration":[161,211],"celebrations":[211],"cell":[600,635],"chai":[222],"champagne":[211],"channel":[640],"charcoal":[215],"charges":[100],"cheap laptop":[630],"check out":[477],"chemistry":[466],"cherry":[218],"chest":[283],"chest of drawers":[283],"chests":[283,283],"chevy":[15],"chicago":[360],"child":[92,224],"childhood education":[92],"children":[92,224],"children's music":[344],"childrens instrument":[344],"childrens music":[344],"chord":[243],"chords":[243],"cinema":[324,325,326,334],"circuit":[614],"circus":[151],"citation":[48,466,469,470,472],"clapper":[332],"class":[135],"classes":[135],"classical":[346],"cleaner":[277,278],"click":[596],"client":[383],"cloth":[278],"clothing":[584],"cloud":[620],"cloud computing":[630],"clown":[336],"club":[271],"CNN":[385],"cocomelon":[344],"coconut":[673],"coffee":[220],"coffin":[171],"cold":[315],"collar":[425],"collars":[425],"college":[135,137],"colleges":[135],"color theory":[207],"comedy":[209,330,348],"comedy film":[330],"comedy movie":[330],"commencement":[137,172],"commitment":[165],"communicate":[607,628],"communication":[420],"community":[607,628],"composers":[346],"composition":[346],"computer":[277,596,599,600,601,607,614,627,630,632,684],"computer gaming":[684],"computer science":[630],"computers":[599],"computing":[596,599,601,620],"concert":[184],"conference":[607],"congestion":[315],"congress":[386],"console game":[681],"constellation":[456],"constructing":[121],"construction":[121],"consumerism":[154],"contemporary art":[155],"content creator":[106],"controller":[681],"converter":[110],"convertible":[8],"convocation":[172],"cook":[216],"cooking":[215,216],"cookout":[215],"coronavirus":[315],"corvette":[8],"costume":[202],"cough":[300],"coughing":[300,315],"countries":[469],"country":[469],"country music":[350],"court":[100,383],"courtroom":[383],"covid":[315],"craft":[254],"crafts":[254],"creative":[204,205],"credit":[63,82,410],"credit union":[63,82,410],"crime":[331],"cube":[242],"cubs":[545],"cucumber":[229],"cucumbers":[229],"cup":[220],"currency":[82],"cycle":[492],"cycling":[492],"d20":[272],"damian marley":[359],"dancehall":[359],"dancing":[158],"data":[618,620,637],"daycare":[92],"dealership":[15],"death":[171],"deck":[271],"decor":[283],"decorations":[161,170],"defendant":[383],"defense":[122],"degree":[135,137],"degrees":[135],"deliveries":[210],"delivery":[169,210],"dell":[630],"delta":[655],"demonstration":[174],"dental":[316],"dentures":[316],"depression":[301],"design":[155,204,205],"designer":[204,681,683,684],"dessert":[217],"desserts":[217],"detective":[331],"development":[681,683,684],"device":[596,601,625,630,632,635,637],"dice":[272],"dictionary":[100],"diet":[231],"digital":[205,632],"digital art":[205],"dining":[179,218],"dinner":[218],"diploma":[137],"disaster":[381],"disco":[158],"disney":[324,325,326,327,329,329,330,330,331,332,333,334,335,336],"disturbed":[363],"dixie":[350],"doc":[332],"documentary":[332],"documents":[48],"dodge":[15],"dog":[425],"doghouse":[425],"dogs":[425],"dolly parton":[350],"donation":[174],"drafting":[204],"dragons":[272],"drama":[326,333],"dramatic film":[333],"drawer":[283],"drawers":[283],"drawing":[204,205],"drink":[222],"drinks":[179],"drive":[601],"dungeons":[272],"dust":[277],"dynamite":[325],"earthquake":[381,470],"eating":[221],"echo":[625],"education":[92,132],"educations":[132],"egg":[229],"election":[386],"electric":[418],"electricity":[110],"electronic":[614],"electronics":[277,278,632,633],"elementary":[92],"elephant":[178],"elvis":[363],"enchantment":[241],"encore":[177],"energy":[86,110],"engagement":[165],"entertain":[279],"episode":[640],"episodes":[324,325,326,327,329,330,330,331,332,333,334,335,336],"eric clapton":[360],"etta james":[360],"excavator":[121],"exchange":[82],"explosion":[325],"external":[601],"extraterrestrial":[327],"facebook":[628],"fair":[151],"family movies":[334],"familysearch":[48],"fan":[176,282],"fans":[282],"fantasy":[335],"farm":[102,466],"fashion":[202,563,589,637],"faster computer":[630],"favorite":[628],"fever":[315],"fiat":[8],"fiction":[48],"fidget":[482],"fidget spinner":[482],"fidgets":[482],"field":[176],"fight scene":[325],"film":[324,325,326,331,332,334,336],"film festival":[324],"filmstrip":[324],"finance":[63,82,410],"finances":[410],"firm":[100],"fit":[637],"flight":[118,653,655],"floss":[316],"flower":[274,275],"flowers":[274],"flu":[315],"fly":[655],"FM":[370],"food":[96,102,210,220,221,229],"food movements":[220],"foods":[229],"football":[370,370],"ford":[15],"fork":[492],"form":[492],"fox":[492],"FOX":[385],"frame":[492],"frame rate":[324],"frameset":[492],"fuel":[86,86,110,418],"funeral":[171],"funeral parlor":[171],"funk":[362],"furniture":[279,283],"furnitures":[283],"galleries":[155],"gallery":[155],"gambling":[181],"game":[176,242,269,271,681],"games":[242,269,271],"gaming":[681,683,684],"garden":[274,275,466],"gardening":[274,275],"gardens":[274,275],"garth brooks":[350],"gas":[86,418],"gas can":[86],"gemini":[456],"geodes":[470],"geography":[469],"geology":[470],"ghost":[363],"giant":[492],"gift idea":[170],"gift ideas":[161],"gifts":[170],"globe":[469],"gold medal":[521],"google":[627],"gown":[172],"graduate":[137],"graduation":[137,172],"grand slam":[545],"graphic design":[204],"graphics":[204],"grill":[215],"grills":[215],"groceries":[477],"groom":[165],"guilty":[100],"guitar":[243],"guitars":[243],"gun":[325],"guns n' roses":[363],"half time":[176],"halloween":[336],"hammer":[470],"handbag":[563],"handlebars":[492],"hank williams":[350],"hard":[363,601],"hashtag":[628],"hawaii":[584],"hbo":[324,325,326,327,329,330,330,331,332,333,334,335,336],"hbomax":[324,325,326,327,329,330,330,331,332,333,334,335,336],"headphones":[348],"health":[224,229,231,637,677],"healthy":[221,229,231,677],"heart":[271],"heat":[216,418],"heater":[418],"heavy":[363],"heavy-duty":[15],"herbal":[222],"herbicide":[466],"high tech":[327],"historical":[48],"histories":[48],"history":[48],"hobbies":[269],"hobby":[269],"home furnishing":[283],"home improvement":[282],"home run":[545],"home security":[281],"home-grown":[275],"homes":[87],"homework":[132],"horoscope":[456],"horror":[336],"hot":[222],"hot dogs":[215],"house":[87,275,277,278,282,283],"house of representatives":[386],"houses":[282,283],"hp":[630],"hulu":[324,325,326,327,329,330,330,331,332,333,334,335,336],"hurricane":[381],"illusion":[241],"illustration":[204],"illustrator":[205],"imagination":[48],"improvements":[282],"inclement weather":[381],"independent":[681,683,684],"indie":[681,683,684],"indies":[681,683,684],"infant":[169],"info":[618,620],"infrastructure":[121],"inning":[176],"innocent":[100],"insomnia":[310],"inspiration":[204,205],"instagram":[628],"instrument":[243,357],"instruments":[357],"interior":[283],"interior design":[283],"intermission":[177],"international":[82,469],"international flight":[655],"internet":[277,281,625],"internet of things":[277,625],"internetofthings":[625],"interview":[376],"investment":[410],"investments":[410],"invocation":[172],"ion":[277],"iot":[277,625],"iphone":[420,683],"iron maiden":[363],"italy":[210],"jamaica":[359],"jamaican":[359],"janice joplin":[360],"japanimation":[329],"jazz":[357],"jigsaw":[269],"jigsaws":[269],"jimi hendrix":[363],"job":[89],"job search":[89],"job searches":[89],"jobs":[89],"john denver":[350],"jonny cash":[350],"journal":[469,470,472],"journals":[48],"judge":[383],"jury":[383],"kayak":[499],"key":[443],"keyboard":[357],"keyboards":[357],"kids movies":[334],"kindergarten":[92],"knight":[335],"lab":[466],"laces":[589],"lake":[499],"landline":[420],"laptop":[596,599,630],"laptop deals":[630],"laptops":[599],"laser":[327],"laugh track":[330],"law":[100,383],"lawyer":[100,383],"led zeppelin":[363],"legal":[100,383],"lenovo":[630],"leo":[456],"letters":[92],"liberal arts":[137],"libra":[456],"libraries":[48],"library":[48],"license":[205],"lifestyle":[231],"light":[209],"like":[628],"linkedin":[628],"linux":[684],"lion":[178],"literature":[48],"live music":[184],"living":[677],"local news":[384],"location":[655],"login":[607],"lottery":[181],"luggage":[653],"lullaby":[344],"lung":[300],"lungs":[300],"mac":[630,684],"macbook":[630],"magazine":[48],"magazines":[48],"magic":[241],"magic man":[241],"magician":[241],"mall":[154,154],"malware":[618],"map":[469],"maps":[469],"market":[87],"mask":[202,336],"masquerade":[202],"match":[176],"meal":[229],"meals":[229],"meat":[215],"men":[584],"men's clothing":[582],"menagerie":[178],"mens":[589],"mens clothing":[582],"mensclothing":[584],"mental health":[301],"merle haggard":[350],"metal":[363],"metallica":[363],"microphone":[370],"microtransaction":[683],"microwave":[216],"military":[122],"missiles":[122],"MLB":[370,545],"mobile":[683],"modern art":[207],"money":[63,82,410],"mouse":[632],"movie":[324,325,325,326,326,327,329,330,331,332,333,334,334,335,336],"movie theatre":[324],"movies":[324],"MSNBC":[385],"mtb":[492],"muddy waters":[360],"municipality":[386],"museum":[155],"museums":[155],"music":[184,243,343,346,348,357,360,362,371,376,625],"mystery":[331],"myth":[335],"national news":[385],"nature":[677],"NBA":[370],"NBC":[385],"netflix":[106,324,325,326,327,329,330,330,331,332,333,334,335,336],"network":[600,628],"networking":[600,628],"new":[15],"new orleans":[357,360],"new years":[211],"newborn":[169],"news":[376,384,385],"newspaper":[384],"NFL":[370],"nightclub":[158],"nightclubs":[158],"nightmares":[310],"nintendo":[681],"nirvana":[363],"non-alcoholic":[222],"norco":[492],"norton":[618],"noticia":[384],"noticias":[384],"npr":[376],"nursery rhyme":[344],"nutrition":[229],"obstetrician":[169],"occupation":[89],"occupations":[89],"ocean":[499],"office":[450],"oil":[86],"old phone":[420],"olympics":[521],"online":[607],"online learning":[607],"online teaching":[607],"opera":[209],"orchestra":[346],"orchestral":[346],"order":[210],"out":[218],"outdoors":[677],"paddleboard":[499],"paint":[254],"paintbrush":[254],"paintbrushes":[254],"painting":[155,254],"paintings":[254],"paints":[254],"palm":[600],"palm tree":[673],"paper":[111],"paranormal":[244],"park":[176],"parties":[158,211],"party":[158,161,170,211,279],"party hats":[161],"party ideas":[170],"party supplies":[170],"pathfinder":[272],"payment":[63],"payments":[63,82],"PC":[684],"pencil":[132],"pencils":[132],"performance":[209,357],"period":[176],"periódico":[384],"peripheral":[632],"personal computer":[684],"personal finance":[410],"personal finances":[410],"personal investing":[410],"pet":[425],"pet care":[425],"pets":[425],"phishing":[618],"phone":[420,635,683],"phone services":[420],"phones":[420],"photo":[204,205],"photos":[204,205],"photoshop":[205],"physical computing":[614],"piano":[346,357],"pickup":[15],"pill":[301,310,315],"pills":[301,310,315],"pink floyd":[363],"pisces":[456],"pitcher":[545],"pizza":[210],"pizzas":[210],"plane":[655],"planet":[472],"plant":[274,275],"plantiff":[383],"plants":[274],"plate":[229],"plates":[229],"platform":[324,325,326,327,329,330,330,331,332,333,334,335,336],"play":[176,177,242,269,269,271,271,272,482,681,683,684],"plays":[209,269],"playtest":[681,683,684],"playtesting":[681,683,684],"plug":[110],"podcast":[348,376],"politic":[386],"political":[386],"politics":[174,386],"pop art":[207],"post":[628],"posts":[628],"pot":[274],"pounds":[231],"preschool":[92],"present idea":[170],"present ideas":[161],"presents":[170],"president":[386],"presley":[363],"printer":[111],"printing":[111],"printing press":[111],"printmaking":[207],"privacy":[596,599,600,607,618,620,625,628,628,633,635],"production":[332],"programmers":[681,683,684],"projector":[324],"propane":[215],"property":[443,450],"proposal":[165],"protest":[174],"prozac":[301],"public radio":[376],"publications":[48],"publishing":[111],"punk":[363],"puppy":[425],"purse":[563],"puzzle":[242,269,269],"puzzles":[242],"queen":[363],"rabbit":[241],"radio":[370,371,376],"rainbow":[217],"rally":[174],"ram":[15],"ramones":[363],"ransomware":[618],"ray charles":[360],"ray gun":[327],"razor":[594],"razors":[594],"realtor":[87],"realty":[87],"reception":[165],"record":[343],"recordplayer":[343],"rectal probe":[244],"red carpet":[177],"red sox":[545],"reddit":[628],"reform":[174],"reggae":[359],"rehearsal dinner":[165],"REI":[677],"remote":[607],"remote learning":[607],"rental":[443],"representative":[386],"research":[469,470,472],"residency":[155],"respiratory":[300],"restaraunt":[179],"retail":[443,477],"review video":[106],"ribs":[215],"riddle":[269],"riddles":[269],"ride":[151,151],"roblox":[681],"robot":[638],"robotic":[277],"robotics":[638],"rock":[363],"rocket":[472],"rocks":[470],"rockstar":[243],"rockstars":[243],"role":[272],"roleplay":[272],"roleplaying":[272],"roller coaster":[151],"romance":[326],"romantic comedy":[326],"romcom":[326],"romedy":[326,330],"roomba":[277],"root":[274],"roots":[274,359],"rotary phone":[420],"rubik":[242],"runny nose":[315],"sagittarius":[456],"sale":[477],"saltlife":[499],"samsung":[630],"sand":[673],"saving":[410],"sax":[362],"saxophone":[362],"school":[92,132,135],"school supplies":[132],"schools":[92,132],"science":[466,469,469,470,472,472],"science class":[466],"science fiction":[327],"sciences":[472],"scorpio":[456],"scott":[492],"sculpture":[155],"search":[627],"secure":[596,599,600,607,618,620,625,628,632,633,635],"securities":[281],"security":[122,281,618,620],"senate":[386],"senator":[386],"sentencing":[383],"services":[100],"share":[628],"shark":[277],"shark ion":[277],"shave":[594],"shaving":[594],"sheet music":[357],"ship":[472],"shirt":[584],"shoe":[589],"shoes":[589],"shop":[477],"shopping":[154,477],"shopping cart":[477],"shopping center":[154],"shopping spree":[154],"shutter speed":[324],"sick":[315],"sit and spin":[224],"skype":[607],"slack":[607,628],"sleep":[310],"sleeping":[310],"sleeping mask":[310],"slip-on":[589],"slot machine":[181],"slots":[181],"slow computer":[630],"smarthome":[277,625],"smartphone":[420,635],"smoking":[300],"smoothie":[221],"soca":[359],"social":[628],"soda":[218],"soft top":[8],"softgel":[301,310,315],"softgels":[301,310,315],"solicitor":[100],"sony":[630],"sorcery":[241],"soul":[360,362],"sound":[625],"southwest":[655],"space":[327,472],"space heater":[418],"spaceship":[244],"spade":[271],"specialized":[492],"spin":[224,482],"spinach":[275],"spinner":[482],"spirits":[179],"sport":[499,637],"sporting event":[176],"sports":[176],"sports car":[8],"sports utility vehicle":[6],"spotlight":[209],"spyware":[618],"squash":[275],"stage":[209],"stage light":[209],"staple":[450],"stapler":[450],"star":[472],"star trek":[327],"star wars":[327],"starsign":[456],"steam":[684],"stock":[204,205],"stories":[48],"storm":[381],"story":[48],"streamers":[492],"streaming":[324,325,326,327,329,330,330,331,332,333,334,335,336,681,683,684],"strike out":[545],"strings":[243],"strip mall":[154],"stunts":[325],"stylus":[205],"subscribe":[628],"suit":[271],"suitcase":[653],"summer games":[521],"summer olympics":[521],"supermarket":[154],"supplies":[161,450],"supreme court":[383],"surveillance":[281],"surveillance camera":[281],"surveillance cameras":[281],"surveillances":[281],"suspension":[492],"sustainable":[677],"suv":[6],"suvs":[6],"switch":[681],"sword":[335],"symphonic":[346],"symphony":[346],"table":[279],"tablet":[205],"tabletop":[272],"talk":[371],"tank":[122],"taurus":[456],"TBS":[385],"tea":[222],"teaching online":[607],"team":[607,628],"teapot":[222],"teapots":[222],"teas":[222],"tech":[277,281,282,596,600,601,607,614,620,627,633],"technology":[277,281,282,420,472,596,599,600,601,607,614,618,620,625,627,628,630,632,633,633,635,637,638,681,683,684],"teeth":[316],"telecommunications":[420],"telephone":[420],"telephones":[420],"teleportation":[327],"televeision":[640],"television":[385],"televisions":[640],"tent":[151,677],"texas":[350],"the beatles":[363],"the eagles":[363],"the grateful dead":[363],"the rolling stones":[363],"the scream":[155],"the wave":[176],"theater":[177,209,333],"theaters":[177],"theatre":[177,209,333],"theatres":[177],"theme park":[151],"therapy":[301],"thermos":[220],"three days grace":[363],"thriller":[331],"ticket":[333],"tie":[582],"tiered cake":[165],"tiktok":[106],"tomato":[275],"tomato cages":[275],"tombstone":[171],"tongs":[215],"tooth":[316],"toothpaste":[316],"top down":[8],"torch":[521],"tornado":[381],"toshiba":[630],"tourism":[118,653,655],"towable":[15],"tower":[600],"town":[386],"toy":[224,242,482],"toy guitar":[344],"toy instrument":[344],"toy keyboard":[344],"toy piano":[344],"toy story":[329],"toy xylophone":[344],"toyota":[15],"toys":[224,242,482],"tractor":[102],"tractors":[350],"tragedy":[209,381],"trail":[492],"travel":[110,118,653,655,677],"tree":[600],"trek":[492],"tropical":[673],"truck":[15],"trucks":[15],"TSA":[118],"tv":[640],"tvs":[640],"tweet":[628],"twitter":[628],"typing":[599],"U2":[363],"ufo":[244],"UFO":[327],"unboxing":[106],"union":[63],"universities":[135],"university":[135,137],"university of":[137],"used":[15],"utility":[6],"vacation":[673],"vacuum":[277],"vans":[589],"vector":[204,205],"vectors":[204,205],"vegetable":[96,229],"vegetables":[229],"veggie":[96],"veggies":[229],"vehicle":[6,8],"vehicles":[6,8],"venue":[184],"video":[106,681],"video game":[681,683],"videogame":[681],"videogames":[681],"vikings":[370],"vimeo":[106],"vine":[106],"vinyl":[359],"violin":[346],"virgo":[456],"virus":[315],"voting":[386],"wacom":[205],"war":[122],"wardrobe":[202],"washer":[278],"watch":[324,325,326,327,329,330,330,331,332,333,334,335,336,637],"water":[275,499],"wayfair":[283],"weapons":[122],"web conference":[607],"webcam":[607],"wedding":[165,211],"weddings":[211],"weed":[274],"weeds":[274],"weight":[231],"weight loss":[231],"wheelset":[492],"white sox":[545],"whitelist":[91],"wild flowers":[275],"wildlife":[178],"willie nelson":[350],"win":[181],"windows":[684],"wine":[179],"winter games":[521],"wizardry":[241],"women's fashion":[563],"woof":[425],"work":[89],"world":[469],"writing":[132],"yankees":[545],"youtube":[106,628],"zebra":[178],"zine":[48],"zines":[48],"zodiac":[456],"zoo":[178],"zoology":[178],"zoom":[607]}; 

return { data: data }; 

})(); 
