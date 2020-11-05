<template>
  <div id="app">
    <!-- при открытии всплывающего окна к элементу "wdg" добавлять "wdg--popup-active" -->
    <!-- ночной режим задается классом "wdg--night" -->
    <div class="wdg">
      <div class="wdg__wrap">
        <div class="wdg-top">
          <div class="wdg-title">48 комментариев</div>

          <div class="wdg-main-sort">
            <div class="wdg-main-sort__title">
              <span class="wdg-icon"></span>
              По популярности
            </div>
          </div>
        </div>

        <Message/>

        <div class="wdg-user">
					<span class="wdg-user__ava">
						<img src="img/ava1.jpg" alt="">
					</span>
          <span class="wdg-user__text">Вы вошли как Антон Корабликов.</span>
          <a class="wdg-user__exit" href="">Выйти</a>
        </div>


        <div class="wdg-notify">
          <span class="wdg-notify__icon wdg-icon-info"></span>
          Оставляя комментарии на этом сайте, можно получать монеты COMMENTUS, котые затем можно тратить на привычные вам вещи. <a href="">Подробнее</a>
        </div>


        <div class="wdg-comments">
          <div class="wdg-comment">
            <div class="wdg-comment__wrap">
              <!-- ава и имя могут быть ссылками -->
              <a href="" class="wdg-comment__ava">
                <img src="img/ava1.jpg" alt="">
              </a>

              <div class="wdg-comment__inner">
                <div class="wdg-comment__top">
                  <a href="" class="wdg-name">Николай</a>
                  <div class="wdg-reward">🏅</div>
                  <div class="wdg-date">4 дня назад</div>
                </div>

                <div class="wdg-comment__text">
                  Провоз кошек и собак одномерно синхронизует барионный вулканизм. Сырдарья изящно выбирает разрыв.
                </div>

                <div class="wdg-comment__bottom">
                  <a class="wdg-link" href="">Ответить</a>

                  <div class="wdg-rate">
                    <div class="wdg-rate__like"></div>

                    <div class="wdg-rate__num">38</div>

                    <div class="wdg-rate__dislike"></div>
                  </div>
                </div>

                <!-- для раскрытого состояния класс wdg-open -->
                <Message/>

              </div>
            </div>
          </div>
          <!-- end wdg-comment -->


          <div class="wdg-comment">
            <div class="wdg-comment__wrap">
              <div class="wdg-comment__ava">
                <img src="img/ava2.jpg" alt="">
              </div>

              <div class="wdg-comment__inner">
                <div class="wdg-comment__top">
                  <div class="wdg-name">Елена Петровна</div>
                  <div class="wdg-date">6 дней назад</div>
                </div>

                <div class="wdg-comment__text">
                  Линза параллельна. Вселенная параллельна. Гетерогенная структура, даже при наличии сильных аттракторов, отражает особый вид куниц. Нижнедунайская равнина перманентно выбирает глубокий сверхпроводник, а Хайош-Байа славится красными винами.
                </div>



                <div class="wdg-comment__bottom">
                  <a class="wdg-link" href="">Ответить</a>

                  <div class="wdg-rate">
                    <div class="wdg-rate__like"></div>

                    <div class="wdg-rate__num --wdg-red">-12</div>

                    <div class="wdg-rate__dislike">
                    </div>
                  </div>

                  <a class="wdg-comment__share" href="">
                    <span class="wdg-t">Поделиться</span>
                    <span class="wdg-i"></span>
                  </a>
                </div>
              </div>
            </div>


            <div class="wdg-comment">
              <div class="wdg-comment__wrap">
                <div class="wdg-comment__ava --wdg-anonim">
                </div>

                <div class="wdg-comment__inner">
                  <div class="wdg-comment__top">
                    <div class="wdg-name">Анонимный персонаж</div>
                    <div class="wdg-date">6 дней назад</div>
                  </div>

                  <div class="wdg-comment__text">Здесь работали Карл Маркс и Владимир Ленин, но химическое соединение трансформирует кварк.</div>

                  <div class="wdg-comment__bottom">
                    <a class="wdg-link" href="">Ответить</a>

                    <div class="wdg-rate">
                      <div class="wdg-rate__like"></div>

                      <div class="wdg-rate__dislike"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- end wdg-comment -->


            <div class="wdg-comment">
              <div class="wdg-comment__wrap">
                <div class="wdg-comment__ava">
                  <img src="img/ava3.jpg" alt="">
                </div>

                <div class="wdg-comment__inner">
                  <div class="wdg-comment__top">
                    <div class="wdg-name">Анастасия</div>
                    <div class="wdg-date">6 дней назад</div>
                  </div>

                  <div class="wdg-comment__text">Многолетняя мерзлота вращает знаменитый Фогель-маркет на Оудевард-плаатс.</div>

                  <div class="wdg-comment__bottom">
                    <a class="wdg-link" href="">Ответить</a>

                    <div class="wdg-rate">
                      <div class="wdg-rate__like"></div>

                      <div class="wdg-rate__dislike"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- end wdg-comment -->
          </div>
          <!-- end wdg-comment -->
        </div>


        <button class="wdg-comments__more">
          Показать ещё
        </button>
      </div>
    </div>
    <!-- end wdg -->
  </div>
</template>

<script>
import Message from "@/components/Message";

export default {
  name: "App",
  components: {
    Message
  },
  data() {
    return {

    }
  }
};
</script>