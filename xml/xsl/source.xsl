<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0">
    <xsl:output encoding="UTF-8" method="json" indent="yes"/>
    <xsl:strip-space elements="*"/>
    <xsl:include href="header.xsl"/>
    <xsl:include href="text.xsl"/>
    <xsl:template match="/">
        <xsl:map>
            <xsl:map-entry key="'date'" select="current-dateTime()"/>
            <xsl:map-entry key="'id'" select="replace(base-uri(), '^.+/([\w-]+)\.xml$', '$1')"/>
            <xsl:map-entry key="'source'">
                <xsl:map>
                    <xsl:apply-templates/>
                </xsl:map>
            </xsl:map-entry>
        </xsl:map>
    </xsl:template>
    <xsl:template match="tei:TEI">
        <xsl:apply-templates/>
    </xsl:template>
</xsl:stylesheet>