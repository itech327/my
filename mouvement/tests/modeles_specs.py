"""Plans de parcours des modèles pilotes pour modele_pilote_test.py.

Chaque plan donne : la matière, les vrai/faux de « Je me prépare », les réponses justes (calculées ici par un solveur
indépendant, pas lues dans la leçon), les erreurs courantes à tester avec le fragment attendu dans le message,
les termes arabes proscrits ou obligatoires. `h` est le module de test (assistants : type_ok, pick, tap…).
"""
import math


def hyp(a, b):
    return math.sqrt(a * a + b * b)


def leg(c, a):
    return math.sqrt(c * c - a * a)


def fmt(x):
    return str(int(round(x))) if abs(x - round(x)) < 1e-9 else f'{x:.2f}'.replace('.', ',')


# ---------------------------------------------------------------- Pythagore (2AC, géométrie)
async def pyth_faisons(pg, h):
    await pg.locator('section.on input[type=range]').first.fill('6')
    await pg.locator('section.on input[type=range]').nth(1).fill('8')
    await h.type_ok(pg, fmt(hyp(6, 8) ** 2))
    await h.pick(pg, 'c² est toujours égal à a² + b²')
    await pg.locator('section.on svg [aria-label="côté EF"]').click()
    await pg.wait_for_timeout(500)
    await h.type_ok(pg, fmt(8 ** 2 + 15 ** 2))
    await h.type_ok(pg, fmt(hyp(8, 15)))
    await h.pick(pg, 'soustrait les carrés')
    await h.type_ok(pg, fmt(26 ** 2 - 10 ** 2))
    await h.type_ok(pg, fmt(leg(26, 10)))
    await h.pick(pg, 'le plus grand')
    await h.type_ok(pg, fmt(25 ** 2))
    await h.type_ok(pg, fmt(7 ** 2 + 24 ** 2))
    await h.pick(pg, '25² = 7² + 24² : le triangle est rectangle')


async def pyth_seul(pg, h):
    await h.type_ok(pg, fmt(hyp(16, 12)))
    await h.type_ok(pg, fmt(leg(41, 9)))
    await h.pick(pg, 'Il n\'est pas rectangle : 5² + 6² = 61')
    await h.type_ok(pg, fmt(hyp(12, 5)))


async def pyth_defi(pg, h):
    await h.defi_nums(pg, [fmt(math.sqrt(2)), fmt(hyp(20, 21)), fmt(leg(15, 12))])


async def pyth_diag(pg, h):
    await h.diag_num(pg, [('28', 'additionné les côtés'), ('400', 'racine carrée'), ('4', 'soustrait'), ('7', 'Pas encore')])
    await h.type_ok(pg, '20')
    await h.diag_num(pg, [('1600', 'racine carrée'), ('1762', 'additionné'), ('32', 'soustrait les côtés'), ('50', 'impossible')])
    await h.type_ok(pg, '40')
    await h.diag_opt(pg, [('5 + 6 > 8', 'inégalité'), ('61 est proche de 64', 'Proche ne suffit pas'), ('8 est trop grand', 'longueur seule')])
    await h.pick(pg, 'Il n\'est pas rectangle : 5² + 6² = 61')
    await h.type_ok(pg, '13')


SPECS = {
    '2ac-pythagore-modele': dict(
        subject='maths', truth=[False, True, False, True], faisons=pyth_faisons, seul=pyth_seul, defi=pyth_defi, defi_n=3, diag=pyth_diag,
        first_try_after_diag=1, order_prefix="Il n'est pas rectangle : 5² + 6²",
        forbidden_ar=['نظرية', 'بحاضرة', 'ليست هيّ', 'فيثاغورس'], required_ar=['مبرهنة فيتاغورس'], retenir_ar=['مبرهنة فيتاغورس', 'الوتر'],
        geometry=True),

    # ------------------------------------------------------------ Rationnels (2AC, premier cours de maths)
    '2ac-rationnels-modele': dict(
        subject='maths', truth=[True, False, True, True], defi_n=3, first_try_after_diag=0, order_prefix='−3/4 < −1/2',
        forbidden_ar=['نظرية', 'بحاضرة', 'ليست هيّ', 'الأعداد النسبية'], required_ar=['الأعداد الجذرية', 'البسط', 'المقام'], retenir_ar=['العدد الجذري', 'الخارج']),

    # ------------------------------------------------------------ Air (2AC, premier cours de physique-chimie)
    '2ac-air-modele': dict(
        subject='pc', truth=[False, True, False, True], defi_n=3, first_try_after_diag=0, order_prefix='le diazote',
        forbidden_ar=['نظرية', 'بحاضرة', 'ليست هيّ'], required_ar=['ثنائي الأزوت', 'ثنائي الأوكسجين', 'قابل للانضغاط'], retenir_ar=['خليط', 'الضغط']),
}


# ------------------------------------------------ rationnels
async def rat_faisons(pg, h):
    await h.pick(pg, 'négatif', exact=True)
    await h.type_ok(pg, str(-12 // 4))
    await h.pick(pg, 'négatif', exact=True)
    await h.type_ok(pg, str(-18 // 6))
    await h.pick(pg, '−1 et 0', exact=True)
    await h.type_ok(pg, str(-2))
    await h.pick(pg, '−3/4', exact=True)
    await h.pick(pg, '−3/4 < −1/2', exact=True)
    await h.type_ok(pg, str(round(6 / -3)))
    await h.pick(pg, '2/5', exact=True)


async def rat_seul(pg, h):
    await h.type_ok(pg, str(-15 // 5))
    await h.pick(pg, 'négatif', exact=True)
    await h.pick(pg, '−3/4 < −1/2', exact=True)
    await h.type_ok(pg, fmt(-9 / 4))


async def rat_defi(pg, h):
    await h.defi_nums(pg, [str(-21 // -7), fmt(-12 / 5), str(-2 * 4)])


async def rat_diag(pg, h):
    await h.diag_num(pg, [('3', 'oublié le signe'), ('-75', 'multiplié'), ('-10', 'soustrait'), ('7', 'Pas encore')])
    await h.type_ok(pg, '-3')
    await h.diag_opt(pg, [('positif', 'signes différents'), ('on ne peut pas savoir', 'toujours le savoir')])
    await h.pick(pg, 'négatif', exact=True)
    await h.diag_opt(pg, [('−3/4 > −1/2', 'inverse'), ('égaux', 'deux points différents')])
    await h.pick(pg, '−3/4 < −1/2', exact=True)
    await h.diag_num(pg, [('2,25', 'négative'), ('-0,44', 'divisé 4 par 9'), ('-13', 'additionné')])
    await h.type_ok(pg, '-2,25')


# ------------------------------------------------ air
async def air_faisons(pg, h):
    await h.pick(pg, 'diminue', exact=True)
    await h.pick(pg, 'reste le même', exact=True)
    await h.pick(pg, 'la distance entre les particules', exact=True)
    await h.pick(pg, 'augmente', exact=True)
    await h.pick(pg, '78 sur 100', exact=True)
    await h.type_ok(pg, '0,78')
    await h.type_ok(pg, fmt(0.78 * 200))


async def air_seul(pg, h):
    await h.pick(pg, 'le diazote', exact=True)
    await h.pick(pg, 'diminue', exact=True)
    await h.type_ok(pg, fmt(0.21 * 200))
    await h.pick(pg, "Il y a beaucoup d'espace vide entre les particules d'air.", exact=True)


async def air_defi(pg, h):
    await h.defi_nums(pg, [fmt(0.21 * 500), fmt(0.78 * 50)], opt='une masse plus grande quand il est gonflé')


async def air_diag(pg, h):
    await h.diag_opt(pg, [('le dioxygène', 'On respire'), ('le dioxyde de carbone', 'très petite quantité')])
    await h.pick(pg, 'le diazote', exact=True)
    await h.diag_opt(pg, [('augmente', 'effet de la compression'), ('ne change pas', 'La pression change')])
    await h.pick(pg, 'diminue', exact=True)
    await h.diag_num(pg, [('4200', 'diviser par 100'), ('4,2', 'décalé la virgule'), ('179', 'soustrait'), ('221', 'additionné')])
    await h.type_ok(pg, '42')
    await h.diag_opt(pg, [("Les particules d'air rétrécissent.", 'même taille'), ("L'air disparaît quand on le comprime.", 'Rien ne disparaît')])
    await h.pick(pg, "Il y a beaucoup d'espace vide entre les particules d'air.", exact=True)


SPECS['2ac-rationnels-modele'].update(faisons=rat_faisons, seul=rat_seul, defi=rat_defi, diag=rat_diag)
SPECS['2ac-air-modele'].update(faisons=air_faisons, seul=air_seul, defi=air_defi, diag=air_diag)
