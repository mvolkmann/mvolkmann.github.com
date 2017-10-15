<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!--xsl:output method="xml" indent="yes"/-->

  <xsl:template match="/">
    <html>
      <head>
        <title>Mark Volkmann's Bookmarks</title>
        <link rel="stylesheet" type="text/css" href="common.css"/>
      </head>
      <body>
        <a name="top"/>
        <h1>Mark Volkmann's Bookmarks</h1>
        <p>
          <b>Mac Safari hint:</b>
          Hold down the command key when clicking a link to open
          the link in a new tab instead of in a new window.
        </p>
        <xsl:apply-templates select="bookmarks"/>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="bookmarks">
    <!-- Output links to level 1 topics. -->
    <xsl:for-each select="topic">
      <a href="#{@name}"><xsl:value-of select="@name"/></a>
      <!--xsl:text> </xsl:text-->
      <br/>
    </xsl:for-each>

    <!-- Output all the topics with their links. -->
    <ul>
      <xsl:apply-templates select="topic">
        <xsl:sort select="@name"/>
        <xsl:with-param name="level" select="1"/>
      </xsl:apply-templates>
    </ul>
  </xsl:template>

  <xsl:template match="topic">
    <xsl:param name="level"/>

    <xsl:if test="$level = 1">
      <a name="{@name}"/>
    </xsl:if>

    <li class="level{$level}">
      <xsl:value-of select="@name"/>
      <xsl:if test="$level = 1">
        <span class="topLink"> - <a href="#top">top</a></span>
      </xsl:if>
      <ul>
        <xsl:apply-templates>
          <xsl:sort select="@name"/>
          <xsl:with-param name="level" select="$level + 1"/>
        </xsl:apply-templates>
      </ul>
    </li>
  </xsl:template>

  <xsl:template match="mark">
    <li class="mark">
      <a target="_blank" href="{@href}">
        <xsl:value-of select="@name"/>
      </a>
      <xsl:if test="@desc">
        <xsl:value-of select="concat(' - ', @desc)"/>
      </xsl:if>
    </li>
  </xsl:template>

  <xsl:template match="*">
    <div class="error">
      Unexpected element <xsl:value-of select="name()"/> found in XML!
    </div>
  </xsl:template>

</xsl:stylesheet>
